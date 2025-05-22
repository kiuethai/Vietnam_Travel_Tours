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
      // For client chat with admin, we use 'join-chat' event directly
      if (userId === 'admin') {
        socket.emit('join-chat', {});
        console.log('Joining admin chat room directly');
      } else {
        // Normal user-to-user chat scenario
        socketClient.joinChatRoom(userId);

        // Wait a moment to ensure we've joined the room
        setTimeout(() => {
          // Then request chat history
          socketClient.getChatHistory(userId);
          console.log('Requested chat history through socket');
        }, 300);
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
      console.log('Messages array:', response.data.messages || []);

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

      // We'll automatically get new-message event from socket after sending
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
      dispatch({
        type: CHAT_ACTIONS.SEND_MESSAGE_SUCCESS,
        payload: response.data.message
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
      console.log('Received new message:', message);

      // Process the message - ensure it has all required fields
      const processedMessage = {
        ...message,
        // Add any missing fields from different response formats
        message: message.message || '',
        createdAt: message.createdAt || message.createdDate || new Date().toISOString(),
        _id: message._id || message.id || Date.now().toString(),
        // Ensure sender information is correct
        senderID: message.senderID || '',
        recipientID: message.recipientID || '',
        senderRole: message.senderRole || (message.senderID === socket.user?.id ? 'admin' : 'user'),
        // Default attachments to empty array if not present
        attachments: message.attachments || []
      };

      console.log('Processed message for dispatch:', processedMessage);

      dispatch({
        type: CHAT_ACTIONS.SOCKET_MESSAGE_RECEIVED,
        payload: processedMessage
      });

      // Also update the conversation list when a new message arrives
      dispatch(getConversations());

      // If this message relates to the currently selected conversation, refresh messages
      const state = getState?.() || {}; // Get current state if possible
      if (state.chat?.selectedUserId === processedMessage.senderID ||
        state.chat?.selectedUserId === processedMessage.recipientID) {
        // No need to reload all messages - the reducer will add this message to state
        console.log('Message relevant to current conversation');
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
        senderID: msg.senderID || '',
        recipientID: msg.recipientID || '',
        sender: msg.senderRole || '', // Đảm bảo có trường sender
        senderRole: msg.senderRole || '', // Đảm bảo có trường senderRole
        // Default attachments to empty array if not present
        attachments: msg.attachments || []
      })) : [];

      console.log('Processed messages for chat history:', processedMessages);
      dispatch({
        type: CHAT_ACTIONS.GET_MESSAGES_SUCCESS,
        payload: processedMessages
      });
    });

    // Listen for typing indicators
    socket.on('typing', (data) => {
      console.log('Typing indicator:', data);
      dispatch({
        type: CHAT_ACTIONS.SOCKET_TYPING,
        payload: data
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
