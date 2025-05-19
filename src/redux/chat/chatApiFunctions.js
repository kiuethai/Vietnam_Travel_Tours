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
  }
};

export const getMessages = (userId) => async (dispatch) => {
  dispatch({ type: CHAT_ACTIONS.GET_MESSAGES_REQUEST });

  try {
    // Check if socket is connected
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      // Use socket to get messages
      socketClient.joinChat(null, userId);
    } else {
      // Fallback to HTTP if socket isn't connected
      const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/chat/messages/${userId}`);
      dispatch({
        type: CHAT_ACTIONS.GET_MESSAGES_SUCCESS,
        payload: response.data.messages
      });
    }
  } catch (error) {
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
      // Send message via socket
      socketClient.sendSocketMessage({
        senderID: socket.user?.id,
        recipientId: messageData.recipientId,
        text: messageData.text,
        attachments: messageData.attachments || []
      });
    } else {
      // Fallback to HTTP if socket isn't connected
      const formattedData = {
        recipientId: messageData.recipientId,
        message: messageData.text, // Changed from 'text' to 'message' to match backend
        attachments: messageData.attachments || []
      };

      const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/chat/messages`, formattedData);
      dispatch({
        type: CHAT_ACTIONS.SEND_MESSAGE_SUCCESS,
        payload: response.data.message
      });
    }
  } catch (error) {
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
      // Join the chat room for this user
      socketClient.joinChat(null, userId);

      // Mark messages as read
      socketClient.markMessagesAsRead({
        userID: userId,
        adminID: socket.user?.id
      });
    } else {
      // Fallback to HTTP if socket isn't connected
      dispatch(getMessages(userId));
    }
  }
};

// Initialize socket connection
export const initSocketConnection = (token) => (dispatch) => {
  const socket = socketClient.initSocket(token);

  if (socket) {
    // Listen for new messages
    socket.on('new-message', (message) => {
      dispatch({
        type: CHAT_ACTIONS.SOCKET_MESSAGE_RECEIVED,
        payload: message
      });

      // Also update the conversation list when a new message arrives
      dispatch(getConversations());
    });

    // Listen for chat history
    socket.on('chat-history', (messages) => {
      dispatch({
        type: CHAT_ACTIONS.GET_MESSAGES_SUCCESS,
        payload: messages
      });
    });

    // Listen for typing indicators
    socket.on('typing', (data) => {
      dispatch({
        type: CHAT_ACTIONS.SOCKET_TYPING,
        payload: data
      });
    });

    // Listen for messages-read events
    socket.on('messages-read', (data) => {
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
