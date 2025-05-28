import { io } from 'socket.io-client';
import { API_ROOT } from './constants';

class SocketChatClient {
  constructor() {
    this.socket = null;
  }
  // Initialize socket connection
  initSocket(token) {
    if (this.socket) {
      this.socket.disconnect();
    }

    try {
      this.socket = io(API_ROOT, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      return this.socket;
    } catch (error) {
      console.error('Error initializing socket:', error);
      return null;
    }
  }

  // Get the socket instance
  getSocket() {
    if (!this.socket) {
      console.warn('Socket not initialized. Call initSocket first.');
    }
    return this.socket;
  }

  // Disconnect socket
  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected');
    }
  }
  // Join a chat room
  joinChat(userId, adminId) {
    if (!this.socket) return;

    if (adminId) {
      this.socket.emit('join-chat', { adminId });
    } else if (userId) {
      this.socket.emit('join-chat', { userId });
    }
  }

  // Join a chat room - this method is used by chatApiFunctions.js
  joinChatRoom(userId) {
    if (!this.socket) return;

    this.socket.emit('join-chat', { userId });
    console.log('Joining chat room with userId:', userId);
  }

  // Get chat history - this method is used by chatApiFunctions.js
  getChatHistory(userId) {
    if (!this.socket) return;

    // We don't need a separate event for this as 'join-chat' already returns chat history
    // But we'll create it to match the API expectations
    this.socket.emit('join-chat', { userId });
    console.log('Getting chat history for userId:', userId);
  }

  // Send a message
  sendSocketMessage(messageData) {
    if (!this.socket) return;

    this.socket.emit('send-message', messageData);
  }
  // Mark messages as read
  markMessagesAsRead(data) {
    if (!this.socket) return;

    console.log('Marking messages as read:', data);
    this.socket.emit('mark-as-read', data);
  }

  // Typing indicator
  sendTypingIndicator(data) {
    if (!this.socket) return;

    this.socket.emit('typing', data);
  }
  getAdminChat(userId) {
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('get-admin-chat', { userId });
      console.log('Requested admin chat messages for user:', userId);
      return true;
    }
    return false;
  }


}

// Create a singleton instance
const socketClient = new SocketChatClient();
export default socketClient;
