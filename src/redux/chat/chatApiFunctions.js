// This file re-exports all chat action functions in a way that should fix import issues
import authorizedAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
import { toast } from 'react-toastify';
import socketClient from '~/utils/socketChat';
import { CHAT_ACTIONS } from './chatTypes';

// Action Creators
export const getContactUsers = () => async (dispatch) => {
  dispatch({ type: CHAT_ACTIONS.GET_CONTACTS_REQUEST });

  try {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/getAllUsers`);

    dispatch({
      type: CHAT_ACTIONS.GET_CONTACTS_SUCCESS,
      // response.data contains { success, users }
      payload: Array.isArray(response.data.users)
        ? response.data.users
        : []
    });
  } catch (error) {
    dispatch({
      type: CHAT_ACTIONS.GET_CONTACTS_FAILURE,
      payload: error.message
    });
    toast.error('Không thể tải danh sách khách hàng', { theme: 'colored' });
  }
};

export const getConversations = () => async (dispatch) => {
  dispatch({ type: CHAT_ACTIONS.GET_CONVERSATIONS_REQUEST });

  try {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/chat/conversations`);

    dispatch({
      type: CHAT_ACTIONS.GET_CONVERSATIONS_SUCCESS,
      payload: response.data.conversations
    });
  } catch (error) {
    dispatch({
      type: CHAT_ACTIONS.GET_CONVERSATIONS_FAILURE,
      payload: error.message
    });
    // Silent fail for conversations, they might not exist yet

    dispatch({
      type: CHAT_ACTIONS.GET_CONVERSATIONS_SUCCESS,
      payload: [] // Send empty array on failure
    });
  }
};

export const getMessages = (userId) => async (dispatch) => {
  dispatch({ type: CHAT_ACTIONS.GET_MESSAGES_REQUEST });

  try {
    console.log('Getting messages for userId:', userId);

    // Check if socket is connected
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      // Đối với cuộc trò chuyện của khách hàng với quản trị viên, chúng tôi sử dụng sự kiện 'join-chat' trực tiếp
      if (userId === 'admin') {
        // Sử dụng hàm mới để lấy tin nhắn admin
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const currentUserId = currentUser?.user?.id;

        if (currentUserId) {
          socketClient.getAdminChat(currentUserId);
          console.log('Requesting admin chat with user ID:', currentUserId);
        }
      } else {
        // Normal user-to-user chat scenario
        socketClient.joinChatRoom(userId);
        socketClient.getChatHistory(userId);
      }

      // Note: Socket events will be handled in initSocketConnection function    } else {
      // Fallback to HTTP if socket isn't connected
      console.log('Socket not connected, falling back to HTTP');

      let endpoint;
      // Luôn sử dụng đường dẫn admin/ cho cả hai trường hợp
      if (userId === 'admin') {
        // For admin chat, get the current user's ID
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const currentUserId = currentUser?.user?.id;

        if (currentUserId) {
          endpoint = `${API_ROOT}/v1/chat/messages/admin/${currentUserId}`;
        } else {
          console.error('Cannot get messages - current user ID not available');
          return;
        }
      } else {
        // Khi admin chat với user, luôn dùng endpoint admin/
        endpoint = `${API_ROOT}/v1/chat/messages/admin/${userId}`;
      }

      const response = await authorizedAxiosInstance.get(endpoint);
      console.log('HTTP response for messages:', response.data);


      if (Array.isArray(response.data.messages)) {
        const userMessages = response.data.messages.filter(m => m.senderRole === 'user');
        const adminMessages = response.data.messages.filter(m => m.senderRole === 'admin');
        console.log('User messages in API response:', userMessages.length);
        console.log('Admin messages in API response:', adminMessages.length);
      }

      // Log chi tiết hơn để debug
      // console.log('Messages array:', response.data.messages || []);

      // Thêm xử lý để chuẩn hóa dữ liệu
      const processedMessages = (response.data.messages || []).map(msg => ({
        ...msg,
        _id: msg._id || msg.id || Date.now().toString(),
        createdAt: msg.createdAt || msg.createdDate || new Date().toISOString(),
        sender: msg.sender || msg.senderRole || ''
      }));

      dispatch({
        type: CHAT_ACTIONS.GET_MESSAGES_SUCCESS,
        payload: processedMessages
      });
    }
  } catch (error) {
    console.error('Error getting messages:', error);
    dispatch({
      type: CHAT_ACTIONS.GET_MESSAGES_FAILURE,
      payload: error.message
    });
    toast.error('Không thể tải tin nhắn', { theme: 'colored' });
  }
};

export const sendMessage = (messageData) => async (dispatch) => {
  dispatch({ type: CHAT_ACTIONS.SEND_MESSAGE_REQUEST });

  try {
    // Check if socket is connected
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      // Handle admin chat case differently
      if (messageData.recipientID === 'admin') {
        // For admin chat, we don't need to join a room first
        socket.emit('send-message', {
          senderID: socket.user?.id,
          recipientID: messageData.recipientID,
          message: messageData.message,
          attachments: messageData.attachments || []
        });
      } else {
        // Normal user-to-user chat flow
        // First make sure we have joined the right chat room
        socketClient.joinChatRoom(messageData.recipientID);

        // Then send message via socket
        socketClient.sendSocketMessage({
          senderID: socket.user?.id,
          recipientID: messageData.recipientID,
          message: messageData.message,
          attachments: messageData.attachments || []
        });
      }

      // Lưu ý: KHÔNG cần gửi action success ở đây vì ta đã tạo tin nhắn tạm thời trước đó
      // Tin nhắn sẽ được thay thế khi nhận được sự kiện new-message từ socket
      console.log('Message sent via socket:', messageData);
    } else {
      // Fallback to HTTP if socket isn't connected
      console.log('Socket not connected, sending message via HTTP');
      const formattedData = {
        recipientID: messageData.recipientID,
        message: messageData.message,
        attachments: messageData.attachments || []
      };

      const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/chat/messages`, formattedData);

      // Process response to ensure it has consistent format with socket messages
      const processedMessage = {
        ...response.data.message,
        _id: response.data.message._id || response.data.message.id || Date.now().toString(),
        createdAt: response.data.message.createdAt || response.data.message.createdDate || new Date().toISOString(),
        sender: response.data.message.senderRole || '',
        senderRole: response.data.message.senderRole || '',
        isTemp: false
      };

      dispatch({
        type: CHAT_ACTIONS.SEND_MESSAGE_SUCCESS,
        payload: processedMessage
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    dispatch({
      type: CHAT_ACTIONS.SEND_MESSAGE_FAILURE,
      payload: error.message
    });
    toast.error('Không thể gửi tin nhắn', { theme: 'colored' });
  }
};

export const selectConversation = (userId) => (dispatch) => {
  dispatch({
    type: CHAT_ACTIONS.SELECT_CONVERSATION,
    payload: userId
  });

  if (userId) {
    // Join chat room and mark messages as read
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      // Handle admin chat case differently
      if (userId === 'admin') {
        // For admin chat, emit join-chat directly
        socket.emit('join-chat', {});

        // Mark messages as read for admin chat
        socketClient.markMessagesAsRead({
          userID: socket.user?.id,
          adminID: 'admin'
        });
      } else {
        // Join the chat room for normal user-to-user chat
        socketClient.joinChatRoom(userId);

        // Mark messages as read
        socketClient.markMessagesAsRead({
          userID: userId,
          adminID: socket.user?.id
        });
      }
    } else {
      // Fallback to HTTP if socket isn't connected
      dispatch(getMessages(userId));
    }
  }
};

// Initialize socket connection
export const initSocketConnection = (token) => (dispatch, getState) => {
  console.log('Initializing socket connection with token');
  const socket = socketClient.initSocket(token);

  dispatch({
    type: CHAT_ACTIONS.SOCKET_INIT,
    payload: true
  });
  if (socket) {    // Listen for new messages
    socket.on('new-message', (message) => {
      console.log('Nhận tin nhắn mới từ socket:', message);

      // Xử lý tin nhắn - đảm bảo có tất cả các trường cần thiết
      const processedMessage = {
        ...message,
        // Thêm các trường bị thiếu từ nhiều định dạng phản hồi khác nhau
        message: message.message || '',
        createdAt: message.createdAt || message.createdDate || new Date().toISOString(),
        _id: message._id || message.id || Date.now().toString(),
        // Đảm bảo thông tin người gửi được chuẩn hóa để phù hợp với reducer
        senderID: message.senderID || message.senderId || '',
        recipientID: message.recipientID || message.recipientId || '',
        sender: message.sender || message.senderRole || (message.senderID === socket.user?.id ? 'admin' : 'user'),
        senderRole: message.senderRole || (message.senderID === socket.user?.id ? 'admin' : 'user'),
        // Mảng đính kèm mặc định nếu không có
        attachments: message.attachments || [],
        // Đảm bảo tin nhắn không còn là tạm thời
        isTemp: false
      };

      console.log('Processed message for dispatch:', processedMessage);

      dispatch({
        type: CHAT_ACTIONS.SOCKET_MESSAGE_RECEIVED,
        payload: processedMessage
      });

      // Also update the conversation list when a new message arrives
      dispatch(getConversations());

      // If this message relates to the currently selected conversation, mark as read
      const state = getState?.() || {}; // Get current state if possible
      if (state.chat?.selectedUserId === processedMessage.senderID) {
        // Mark messages as read if they are from the selected user
        socketClient.markMessagesAsRead({
          userID: processedMessage.senderID,
          adminID: socket.user?.id
        });
      }
    });

    // Listen for chat history
    socket.on('chat-history', (messages) => {
      console.log('Raw chat history from socket:', messages);

      // Process messages to ensure consistent format
      const processedMessages = Array.isArray(messages) ? messages.map(msg => ({
        ...msg,
        message: msg.message || '',
        createdAt: msg.createdAt || msg.createdDate || new Date().toISOString(),
        _id: msg._id || msg.id || Date.now().toString(),
        // Ensure sender information is correct
        senderID: msg.senderID || msg.senderId || '',
        recipientID: msg.recipientID || msg.recipientId || '',
        sender: msg.senderRole || (msg.senderID === socket.user?.id ? 'admin' : 'user'),
        senderRole: msg.senderRole || (msg.senderID === socket.user?.id ? 'admin' : 'user'),
        // Default attachments to empty array if not present
        attachments: msg.attachments || []
      })) : [];

      console.log('Processed messages for chat history:', processedMessages);
      dispatch({
        type: CHAT_ACTIONS.GET_MESSAGES_SUCCESS,
        payload: processedMessages
      });
    });    // Listen for typing indicators
    socket.on('typing', (data) => {
      console.log('Typing indicator received:', data);

      // Process typing data to ensure it has consistent format
      const typingPayload = {
        userId: data.userId || '',
        adminId: data.adminId || '',
        isTyping: !!data.isTyping // Convert to boolean
      };

      dispatch({
        type: CHAT_ACTIONS.SOCKET_TYPING,
        payload: typingPayload
      });
    });

    // Listen for messages-read events
    socket.on('messages-read', (data) => {
      console.log('Messages read event:', data);
      dispatch({
        type: CHAT_ACTIONS.SOCKET_READ_RECEIPT,
        payload: data
      });
    });

    // Listen for error events
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'Socket error occurred', { theme: 'colored' });
    });

    dispatch({
      type: CHAT_ACTIONS.SOCKET_INIT,
      payload: true
    });
  }
};

// Disconnect socket
export const disconnectSocketConnection = () => (dispatch) => {
  socketClient.disconnectSocket();

  dispatch({
    type: CHAT_ACTIONS.SOCKET_INIT,
    payload: false
  });
};

// Export a default object containing all functions as well
const chatActions = {
  getContactUsers,
  getConversations,
  getMessages,
  sendMessage,
  selectConversation,
  initSocketConnection,
  disconnectSocketConnection
};

export default chatActions;
