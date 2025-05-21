// filepath: d:\react-bg\Vietnam_Travel_Tours\FULL_CODE\FE_Vietnam_Travel_Tours\travel_tour_vn\src\components\Client\Chat\ClientChat.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton, TextField, Button, Typography, Avatar, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import moment from 'moment';
import socketClient from '../../../utils/socketChat';
import { selectCurrentUser } from '~/redux/user/userSlice';
// Import action functions
import { getMessages, sendMessage, initSocketConnection, disconnectSocketConnection } from '../../../redux/chat/chatApiFunctions';

// Styled components
const ChatButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ChatWindow = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '6rem',
  right: '2rem',
  width: '350px',
  height: '500px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 1000,
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}));

const MessageBubble = styled(Box)(({ theme, isuser }) => ({
  maxWidth: '80%',
  padding: '10px 14px',
  borderRadius: isuser === 'true' ? '16px 16px 0 16px' : '16px 16px 16px 0',
  backgroundColor: isuser === 'true' ? theme.palette.primary.main : '#f1f0f0',
  color: isuser === 'true' ? '#fff' : '#000',
  alignSelf: isuser === 'true' ? 'flex-end' : 'flex-start',
  wordBreak: 'break-word',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
}));

const MessageTime = styled(Typography)(({ theme, isuser }) => ({
  fontSize: '11px',
  color: isuser === 'true' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  marginTop: '4px',
  textAlign: isuser === 'true' ? 'right' : 'left',
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  padding: '8px 12px',
  fontSize: '13px',
  color: 'rgba(0, 0, 0, 0.6)',
  fontStyle: 'italic',
  alignSelf: 'flex-start',
  backgroundColor: '#f1f0f0',
  borderRadius: '16px 16px 16px 0',
  marginBottom: '8px',
}));

const InputArea = styled(Box)(({ theme }) => ({
  borderTop: '1px solid #e0e0e0',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

// Component definition
function ClientChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const typingTimeoutRef = useRef(null);

  // Get messages and typing status from redux store
  const messages = useSelector((state) => state.chat?.messages || []);
  const adminTyping = useSelector((state) => state.chat?.typingUsers?.admin || false);

  // Scroll to bottom effect
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Initialize socket only if user is logged in
  useEffect(() => {
    if (currentUser && currentUser.accessToken) {
      // Use the centralized initSocketConnection from redux
      dispatch(initSocketConnection(currentUser.accessToken));

      // Cleanup function
      return () => {
        dispatch(disconnectSocketConnection());
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
  }, [currentUser, dispatch]);

  // Load messages when chat window is opened
  useEffect(() => {
    if (isOpen && currentUser && currentUser?.user?.id) {
      dispatch(getMessages('admin'));

      // Reset unread count when opening chat
      setUnreadCount(0);

      // Mark messages as read
      const socket = socketClient.getSocket();
      if (socket && socket.connected) {
        socketClient.markMessagesAsRead({
          userID: currentUser?.user?.id,
          adminID: 'admin'
        });
      }
    }
  }, [isOpen, currentUser, dispatch]);

  // Update unread count when receiving new messages
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (!isOpen && message.senderID !== currentUser?.user?.id) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    const socket = socketClient.getSocket();
    if (socket) {
      socket.on('new-message', handleNewMessage);

      return () => {
        socket.off('new-message', handleNewMessage);
      };
    }
  }, [isOpen, currentUser?.user?.id]);

  // Handle opening/closing chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Debounced typing function - consistent with admin implementation
  const debouncedTypingHandler = useCallback(
    (isTypingState) => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        const socket = socketClient.getSocket();
        if (socket && socket.connected) {
          socketClient.sendTypingIndicator({
            userId: currentUser?.user?.id,
            adminId: 'admin',
            isTyping: isTypingState
          });
        }
        typingTimeoutRef.current = null;
      }, 500);
    },
    [currentUser]
  );

  // Handle typing indicator
  const handleMessageInputChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);

    if (currentUser?.user?.id) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send typing indicator only if state changed
      if (value.length > 0 && !isTyping) {
        setIsTyping(true);
        debouncedTypingHandler(true);
      } else if (value.length === 0 && isTyping) {
        setIsTyping(false);
        debouncedTypingHandler(false);
      }

      // Set a timeout to clear typing indicator after inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping) {
          setIsTyping(false);
          debouncedTypingHandler(false);
        }
      }, 2000);
    }
  };

  // Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    // If user is not logged in, prompt to login
    if (!currentUser) {
      alert('Vui lòng đăng nhập để gửi tin nhắn');
      return;
    }

    // Create a temporary message object to immediately show in UI
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      message: messageInput.trim(),
      createdAt: new Date().toISOString(),
     
      senderID: currentUser?.user?.id,
      sender: 'user',
      recipientID: 'admin',
      isTemp: true // Mark as temporary so we can replace it when the server responds
    };

    // Add the message to the local state
    dispatch({
      type: 'CHAT_ACTIONS.SEND_MESSAGE_SUCCESS',
      payload: tempMessage
    });

    // Send message to server
    dispatch(sendMessage({
      recipientID: 'admin',
      message: messageInput.trim(),
      attachments: []
    }));

    // Clear the typing indicator when sending a message
    if (isTyping) {
      debouncedTypingHandler(false);
    }

    // Reset input and typing state
    setMessageInput('');
    setIsTyping(false);
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    // To be implemented
    console.log('File upload not implemented yet');
  };

  // Helper function to determine if a message is from the current user
  const isUserMessage = (msg) => {
    return (
    
      msg.senderID === currentUser?.user?.id ||
      msg.sender === 'user'
    );
  };

  return (
    <>
      <ChatButton
        aria-label="chat with support"
        size="large"
        onClick={toggleChat}
      >
        <Badge badgeContent={unreadCount} color="error">
          <ChatIcon fontSize="large" />
        </Badge>
      </ChatButton>

      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 1 }}>A</Avatar>
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
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                </Typography>
              </Box>
            ) : (
              messages.map((msg, index) => {
                const userMessage = isUserMessage(msg);
                return (
                  <MessageBubble 
                    key={msg._id || index}
                    isuser={userMessage ? 'true' : 'false'}
                  >
                    <Typography variant="body2">
                      {msg.message}
                    </Typography>
                    <MessageTime 
                      isuser={userMessage ? 'true' : 'false'} 
                      variant="caption"
                    >
                      {moment(msg.createdAt || msg.createdDate).format('HH:mm DD/MM/YYYY')}
                    </MessageTime>
                  </MessageBubble>
                );
              })
            )}

            {adminTyping && (
              <TypingIndicator>
                Admin đang nhập...
              </TypingIndicator>
            )}

            <div ref={messagesEndRef} />
          </MessageContainer>
          <InputArea component="form" onSubmit={handleSendMessage}>
            {currentUser ? (
              <>
                <IconButton size="small" onClick={handleFileUpload}>
                  <AttachFileIcon fontSize="small" />
                </IconButton>

                <IconButton size="small">
                  <InsertEmoticonIcon fontSize="small" />
                </IconButton>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tin nhắn..."
                  value={messageInput}
                  onChange={handleMessageInputChange}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                  sx={{ fontSize: 14 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={!messageInput.trim()}
                  type="submit"
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
                  sx={{ fontSize: 14 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  href="/login"
                >
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