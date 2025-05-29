import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton, TextField, Button, Typography, Avatar, Badge } from '@mui/material';
// import { styled } from '@mui/material/styles'; // Not used directly in this file if styles are in ./style
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import moment from 'moment';

// Assuming these are local project imports
import socketClient from '../../../utils/socketChat'; // Path to your socket client
import { selectCurrentUser } from '~/redux/user/userSlice'; // Path to your user selector
import { getMessages, sendMessage, initSocketConnection, disconnectSocketConnection } from '../../../redux/chat/chatApiFunctions'; // Path to chat API functions
import { CHAT_ACTIONS } from '../../../redux/chat/chatTypes'; // Path to chat action types

// Styled components (assuming these are correctly defined in './style.js')
import {
  ChatButton,
  ChatWindow,
  ChatHeader,
  MessageContainer,
  MessageBubble,
  MessageTime,
  TypingIndicator,
  InputArea
} from './style';


function ClientChat() {
  const dispatch = useDispatch();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false); // Client's own typing state
  const [unreadCount, setUnreadCount] = useState(0);

  // Refs
  const messagesEndRef = useRef(null); // For scrolling to the latest message
  const messageInputRef = useRef(null); // For focusing the text input
  const typingActivityTimeoutRef = useRef(null); // For managing user's typing inactivity

  // Selectors
  const currentUser = useSelector(selectCurrentUser);
  const messages = useSelector((state) => state.chat?.messages || []);
  const isAdminTyping = useSelector((state) => state.chat?.typingUsers?.admin || false); // Simplified: checks for a specific 'admin' key
  const socketConnected = useSelector((state) => state.chat?.socketConnected);


  // --- EFFECTS ---

  // Initialize and cleanup socket connection
  useEffect(() => {
    if (currentUser && currentUser.accessToken) {
      console.log('ClientChat: Initializing socket connection.');
      dispatch(initSocketConnection(currentUser.accessToken));

      return () => {
        console.log('ClientChat: Cleaning up socket connection.');
        const socket = socketClient.getSocket();
        if (socket && socket.connected && isUserTyping) { // Use isUserTyping (client's state)
          socketClient.sendTypingIndicator({
            userId: currentUser?.user?.id, // This is the client's ID
            adminId: 'admin', // Assuming client always chats with a generic 'admin'
            isTyping: false,
          });
        }
        dispatch(disconnectSocketConnection());
        if (typingActivityTimeoutRef.current) {
          clearTimeout(typingActivityTimeoutRef.current);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, dispatch]); // isUserTyping removed to prevent re-connect on typing

  // Load messages and handle chat open/close actions
  useEffect(() => {
    if (isOpen && currentUser?.user?.id && socketConnected) {
      console.log('ClientChat: Window opened, loading messages.');
      dispatch(getMessages('admin')); // Assuming 'admin' is the recipientID for history
      setUnreadCount(0);

      const socket = socketClient.getSocket();
      if (socket && socket.connected) { // Double check, though socketConnected selector helps
        // Example: socket.emit('join-chat', { userId: currentUser?.user.id, recipientId: 'admin' });
        console.log('ClientChat: Joined admin chat room (if applicable).');
        socketClient.markMessagesAsRead({
          userID: currentUser?.user.id,
          adminID: 'admin',
        });
      }
      // Focus input when chat opens
      if (messageInputRef.current) {
        setTimeout(() => messageInputRef.current.focus(), 100);
      }
    }
  }, [isOpen, currentUser?.user?.id, dispatch, socketConnected]);

  // Scroll to bottom when new messages arrive or admin is typing
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    // A small delay can help ensure the DOM is updated before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, isAdminTyping, scrollToBottom]);


  // Socket event listeners for messages and typing indicators
  useEffect(() => {
    if (!socketConnected || !currentUser?.user?.id) return;

    const socket = socketClient.getSocket();
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log('ClientChat: Received new message:', newMessage);

      const processedMsg = {
        ...newMessage,
        _id: newMessage._id || newMessage.id || `msg_${Date.now()}`,
        createdAt: newMessage.createdAt || newMessage.createdDate || new Date().toISOString(),
        // Determine sender based on senderID or role, assuming admin is not this currentUser
        sender: newMessage.senderID === currentUser?.user.id ? 'user' : 'admin',
        senderRole: newMessage.senderID === currentUser?.user.id ? 'user' : 'admin',
      };

      // Check if the message is relevant (from admin or this user's own confirmed message)
      const isRelevant =
        (processedMsg.senderRole === 'admin' && (processedMsg.recipientID === currentUser?.user.id || !processedMsg.recipientID)) || // Admin to this user (or broadcast from admin)
        (processedMsg.senderID === currentUser?.user.id && processedMsg.recipientID === 'admin'); // This user to admin

      if (isRelevant) {
        dispatch({ type: CHAT_ACTIONS.SOCKET_MESSAGE_RECEIVED, payload: processedMsg });
        // Option: If SOCKET_MESSAGE_RECEIVED fully updates state, getMessages might be redundant
        // dispatch(getMessages('admin')); // Or remove if above action is sufficient

        if (!isOpen && processedMsg.senderID !== currentUser?.user.id) {
          setUnreadCount((prev) => prev + 1);
        }
        if (isOpen) {
          socketClient.markMessagesAsRead({ userID: currentUser?.user.id, adminID: 'admin' });
        }
      }
    };

    const handleChatHistory = (historyMessages) => {
      console.log('ClientChat: Received chat history, count:', Array.isArray(historyMessages) ? historyMessages.length : 0);
      if (Array.isArray(historyMessages)) { // Allow empty history
        dispatch({
          type: CHAT_ACTIONS.GET_MESSAGES_SUCCESS,
          payload: historyMessages.map(msg => ({
            ...msg,
            _id: msg._id || msg.id || `hist_${Date.now()}_${Math.random()}`,
            createdAt: msg.createdAt || msg.createdDate || new Date().toISOString(),
          })),
        });
      }
    };

    // Listen for admin typing status (assuming server sends this structure)
    const handleAdminTypingEvent = (data) => { // e.g., data = { userId: 'admin', isTyping: true }
      if (data.userId === 'admin') {
        dispatch({
          type: CHAT_ACTIONS.SET_ADMIN_TYPING, // You'd need this action type
          payload: data.isTyping
        });
        // Or directly update typingUsers in chat state:
        // dispatch({ type: CHAT_ACTIONS.SET_USER_TYPING, payload: { userId: 'admin', isTyping: data.isTyping }});
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('chat-history', handleChatHistory);
    socket.on('typing-indicator', handleAdminTypingEvent); // Listen for admin typing

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('chat-history', handleChatHistory);
      socket.off('typing-indicator', handleAdminTypingEvent);
    };
  }, [socketConnected, isOpen, currentUser?.user?.id, dispatch]);


  // --- EVENT HANDLERS ---

  const toggleChat = () => setIsOpen(!isOpen);

  const sendUserTypingSignal = useCallback((isTypingState) => {
    if (!currentUser?.user?.id || !socketConnected) return;
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      socketClient.sendTypingIndicator({
        userId: currentUser?.user.id, // Client's ID
        adminId: 'admin', // Target is admin
        isTyping: isTypingState,
      });
    }
  }, [currentUser?.user?.id, socketConnected]);

  const handleMessageInputChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);

    if (typingActivityTimeoutRef.current) {
      clearTimeout(typingActivityTimeoutRef.current);
    }

    if (value && !isUserTyping) {
      setIsUserTyping(true);
      sendUserTypingSignal(true);
    } else if (!value && isUserTyping) {
      setIsUserTyping(false);
      sendUserTypingSignal(false);
    }

    if (value) { // Only set inactivity timeout if there's text
      typingActivityTimeoutRef.current = setTimeout(() => {
        setIsUserTyping(false);
        sendUserTypingSignal(false);
      }, 2000); // 2 seconds of inactivity
    }
  };

  const handleSendMessage = useCallback((event) => {
    if (event) event.preventDefault(); // Prevent form submission if called from form

    if (!messageInput.trim() || !currentUser?.user?.id) {
      if (!currentUser?.user?.id) alert('Vui lòng đăng nhập để gửi tin nhắn.');
      return;
    }

    const tempMessage = {
      _id: `temp_${Date.now()}`,
      message: messageInput.trim(),
      createdAt: new Date().toISOString(),
      senderID: currentUser?.user.id,
      sender: 'user', // Or derive based on currentUser.role if available
      recipientID: 'admin',
      isTemp: true,
    };

    dispatch({ type: CHAT_ACTIONS.SEND_MESSAGE_SUCCESS, payload: tempMessage });
    dispatch(sendMessage({
      recipientID: 'admin',
      message: messageInput.trim(),
      attachments: [], // Placeholder for future use
    }));

    if (isUserTyping) {
      setIsUserTyping(false);
      sendUserTypingSignal(false);
      if (typingActivityTimeoutRef.current) {
        clearTimeout(typingActivityTimeoutRef.current);
      }
    }
    setMessageInput('');

    if (messageInputRef.current) {
      setTimeout(() => messageInputRef.current.focus(), 0); // Re-focus input
    }
  }, [messageInput, currentUser, dispatch, isUserTyping, sendUserTypingSignal]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(); // Pass the event if handleSendMessage expects it
    }
  };

  const handleFileUpload = () => {
    console.log('ClientChat: File upload TBD.');
    // Implement file upload logic here
  };

  const isUserMessage = (msg) => msg.senderID === currentUser?.user?.id || msg.sender === 'user';


  // --- RENDER ---
  if (!currentUser) { // Optionally, don't render chat button if user is not logged in
    // return null; // Or a login prompt button
  }

  return (
    <>
      <ChatButton aria-label="chat with support" size="large" onClick={toggleChat}>
        <Badge badgeContent={unreadCount} color="error">
          <ChatIcon fontSize="large" />
        </Badge>
      </ChatButton>

      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 1 }} src='https://res.cloudinary.com/dbkhjufja/image/upload/v1746778897/aycgbvnmphrhmddyjfuw.png' /> {/* Consider making avatar dynamic */}
              <Typography variant="subtitle1">
                {currentUser ? 'Hỗ trợ khách hàng' : 'Đăng nhập để chat'}
              </Typography>
            </Box>
            <IconButton size="small" onClick={toggleChat} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </ChatHeader>

          <MessageContainer>
            {messages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                </Typography>
              </Box>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg._id} // Ensure _id is unique
                  isuser={isUserMessage(msg) ? 'true' : 'false'}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <MessageTime
                    isuser={isUserMessage(msg) ? 'true' : 'false'}
                    variant="caption"
                  >
                    {moment(msg.createdAt).format('HH:mm DD/MM/YYYY')}
                  </MessageTime>
                </MessageBubble>
              ))
            )}

            {isAdminTyping && (
              <TypingIndicator>Admin đang nhập...</TypingIndicator>
            )}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </MessageContainer>

          <InputArea component="form" onSubmit={handleSendMessage}>
            {currentUser ? (
              <>
                <IconButton size="small" onClick={handleFileUpload} title="Đính kèm tệp">
                  <AttachFileIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" title="Chèn biểu tượng"> {/* Emoji picker can be added here */}
                  <InsertEmoticonIcon fontSize="small" />
                </IconButton>
                <TextField
                  inputRef={messageInputRef} // Assign ref for focus management
                  fullWidth
                  size="small"
                  placeholder="Nhập tin nhắn..."
                  value={messageInput}
                  onChange={handleMessageInputChange}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                  sx={{ fontSize: '14px' }} // Ensure TextField styling matches design
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={!messageInput.trim()}
                  type="submit" // Important for form submission on Enter
                >
                  <SendIcon fontSize="small" />
                </Button>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Đăng nhập để gửi tin nhắn"
                  disabled
                  sx={{ fontSize: '14px' }}
                />
                <Button variant="contained" color="primary" size="small" href="/login">
                  Đăng nhập
                </Button>
              </>
            )}
          </InputArea>
        </ChatWindow>
      )}
    </>
  );
}

export default ClientChat;