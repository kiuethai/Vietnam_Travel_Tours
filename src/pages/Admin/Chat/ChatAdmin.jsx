import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import CircularProgress from '@mui/material/CircularProgress';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css'; // Đảm bảo bạn đã import CSS này
import classNames from 'classnames';
import moment from 'moment';
// Giả sử các import local này là chính xác
import Widget from '~/components/Admin/Widget/Widget';
import {
  getContactUsers,
  getConversations,
  getMessages,
  sendMessage,
  selectConversation,
  initSocketConnection,
  disconnectSocketConnection
} from '~/redux/chat/chatApiFunctions';
import { CHAT_ACTIONS } from '~/redux/chat/chatTypes';
import { selectCurrentAdmin } from '~/redux/admin/adminSlice';
import { useStyles } from './style'; // Giả sử file style.js tồn tại và đúng
import socketClient from '~/utils/socketChat';

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function ChatAdmin() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const chatState = useSelector((state) => state.chat);

  const [messageInput, setMessageInput] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [isTyping, setIsTyping] = useState(false); // Typing state của admin

  // Refs
  const messagesEndRef = useRef(null); // Div ảo ở cuối danh sách tin nhắn (dùng cho scrollIntoView nếu cần)
  const messageContainerRef = useRef(null); // Ref cho PerfectScrollbar của vùng tin nhắn
  const messageInputRef = useRef(null); // Ref cho TextField nhập tin nhắn

  const typingTimeoutRef = useRef(null); // Ref cho timeout của typing indicator
  const previousSelectedUserRef = useRef(null); // Ref lưu ID người dùng được chọn trước đó

  // Derived state from Redux
  const contacts = chatState?.contacts || [];
  const messages = chatState?.messages || [];
  const loading = chatState?.loading || false; // General loading, có thể cần chia nhỏ
  const selectedUserId = chatState?.selectedUserId;
  const typingUsers = chatState?.typingUsers || {}; // { userId: boolean }
  const conversations = chatState?.conversations || [];

  // Kiểm tra xem người dùng đang chat có đang gõ không
  const isUserTyping = typingUsers[selectedUserId] || false;

  // Debounce cho search key
  const [debouncedSearchKey, setDebouncedSearchKey] = useState(searchKey);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchKey(searchKey), 300);
    return () => clearTimeout(handler);
  }, [searchKey]);

  // Khởi tạo và dọn dẹp
  useEffect(() => {
    dispatch(getContactUsers());
    dispatch(getConversations());

    if (currentAdmin?.user?.id) {
      dispatch(initSocketConnection(currentAdmin.accessToken));
    }

    return () => {
      dispatch(disconnectSocketConnection());
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [dispatch, currentAdmin?.user?.id, currentAdmin?.accessToken]);

  // Hàm cuộn xuống dưới cùng
  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      const scrollableNode = messageContainerRef.current; // Đây là div được PerfectScrollbar bọc
      // Cuộn ngay lập tức, không cần behavior: 'smooth' nếu muốn đảm bảo vị trí
      // scrollableNode.scrollTop = scrollableNode.scrollHeight;

      // Hoặc dùng setTimeout(0) để đợi DOM update xong
      setTimeout(() => {
        if (scrollableNode) { // Kiểm tra lại vì có thể unmount trong lúc chờ timeout
          scrollableNode.scrollTop = scrollableNode.scrollHeight;
        }
      }, 0);
    }
    // Fallback or alternative:
    // if (messagesEndRef.current) {
    //   messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // }
  }, []);

  // useEffect cho việc cuộn khi có tin nhắn mới hoặc người dùng/admin gõ
  useEffect(() => {
    // Chỉ cuộn nếu có tin nhắn hoặc có người đang gõ trong cuộc trò chuyện được chọn
    if (selectedUserId && (messages.length > 0 || isUserTyping)) {
      const timerId = setTimeout(() => { // Delay nhẹ để PerfectScrollbar tính toán lại
        scrollToBottom();
      }, 50); // Có thể thử 0, 50, hoặc 100ms
      return () => clearTimeout(timerId);
    }
  }, [messages, isUserTyping, scrollToBottom, selectedUserId]); // Thêm selectedUserId

  // Gửi typing indicator qua socket
  const sendTypingIndicator = useCallback((userId, isTypingStatus) => {
    const socket = socketClient.getSocket();
    if (socket && socket.connected && userId) { // Kiểm tra userId
      socketClient.sendTypingIndicator({
        userId, // Đây là recipientID (người đang chat cùng)
        isTyping: isTypingStatus,
        senderId: currentAdmin?.user?.id // Gửi ID của admin để server biết ai đang gõ
      });
    }
  }, [currentAdmin?.user?.id]);

  // Xử lý khi thay đổi người dùng được chọn
  useEffect(() => {
    if (selectedUserId && selectedUserId !== previousSelectedUserRef.current) {
      dispatch(getMessages(selectedUserId));
      previousSelectedUserRef.current = selectedUserId;
      // Focus vào ô input khi chọn user mới
      if (messageInputRef.current) {
        setTimeout(() => messageInputRef.current.focus(), 100);
      }
    }
  }, [selectedUserId, dispatch]);

  // Chọn một contact/conversation
  const handleContactClick = useCallback((userId) => {
    dispatch(selectConversation(userId));
    // việc focus input sẽ được xử lý bởi useEffect của selectedUserId
  }, [dispatch]);

  // Gửi tin nhắn
  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() && selectedUserId && currentAdmin?.user?.id) {
      const tempMessage = {
        _id: `temp_${Date.now()}`,
        message: messageInput.trim(),
        createdAt: new Date().toISOString(),
        senderID: currentAdmin.user.id,
        sender: 'admin',
        senderRole: 'admin',
        recipientID: selectedUserId,
        isTemp: true,
      };

      dispatch({ type: CHAT_ACTIONS.SEND_MESSAGE_SUCCESS, payload: tempMessage });
      dispatch(sendMessage({
        recipientID: selectedUserId,
        message: messageInput.trim(),
        attachments: []
      }));

      sendTypingIndicator(selectedUserId, false); // Thông báo admin ngừng gõ
      setMessageInput('');
      setIsTyping(false); // Admin ngừng gõ
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Focus lại vào ô input
      if (messageInputRef.current) {
        setTimeout(() => messageInputRef.current.focus(), 0);
      }
      // scrollToBottom(); // useEffect messages sẽ xử lý cuộn
    }
  }, [messageInput, selectedUserId, dispatch, sendTypingIndicator, currentAdmin?.user?.id]);

  // Debounce cho việc gửi typing indicator của admin
  const debouncedAdminTypingHandler = useCallback(
    debounce((isTypingState, userId) => {
      sendTypingIndicator(userId, isTypingState);
    }, 500), // Gửi sau 500ms ngừng gõ hoặc bắt đầu gõ
    [sendTypingIndicator]
  );

  // Xử lý khi nội dung ô input thay đổi (admin gõ)
  const handleMessageInputChange = useCallback((e) => {
    const currentMessage = e.target.value;
    setMessageInput(currentMessage);

    if (selectedUserId) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      if (currentMessage && !isTyping) { // Nếu có chữ và chưa ở trạng thái isTyping
        setIsTyping(true);
        debouncedAdminTypingHandler(true, selectedUserId);
      } else if (!currentMessage && isTyping) { // Nếu xóa hết chữ và đang ở trạng thái isTyping
        setIsTyping(false);
        debouncedAdminTypingHandler(false, selectedUserId);
      }

      // Timeout để tự động set isTyping = false nếu admin ngừng gõ 2 giây
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping) { // Chỉ gửi nếu trạng thái isTyping là true
          setIsTyping(false);
          debouncedAdminTypingHandler(false, selectedUserId);
        }
      }, 2000); // 2 giây
    }
  }, [selectedUserId, isTyping, debouncedAdminTypingHandler]);

  // Xử lý khi nhấn Enter
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Xử lý thay đổi ô tìm kiếm contact
  const handleSearchChange = useCallback((e) => {
    setSearchKey(e.target.value);
  }, []);

  // Lọc danh sách contact dựa trên searchKey
  const filteredContacts = React.useMemo(() => {
    const contactsList = Array.isArray(contacts) ? contacts : [];
    if (!debouncedSearchKey) return contactsList;
    return contactsList.filter(contact =>
      contact.displayName?.toLowerCase().includes(debouncedSearchKey.toLowerCase()) ||
      contact.email?.toLowerCase().includes(debouncedSearchKey.toLowerCase())
    );
  }, [contacts, debouncedSearchKey]);

  // Lấy thông tin người dùng đang được chọn
  const selectedUser = React.useMemo(() => {
    const contactsList = Array.isArray(contacts) ? contacts : [];
    return contactsList.find(contact => contact._id === selectedUserId);
  }, [contacts, selectedUserId]);


  // Lắng nghe sự kiện từ socket
  useEffect(() => {
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      const handleNewMessage = (message) => {
        const processedMessage = {
          ...message,
          _id: message._id || message.id || `socket_${Date.now()}_${Math.random()}`,
          createdAt: message.createdAt || message.createdDate || new Date().toISOString(),
          sender: message.sender || message.senderRole || (message.senderID === currentAdmin?.user?.id ? 'admin' : 'user'),
          senderRole: message.senderRole || (message.senderID === currentAdmin?.user?.id ? 'admin' : 'user'),
        };

        // Kiểm tra xem tin nhắn có thuộc về cuộc trò chuyện hiện tại không
        const isRelevantToCurrentChat = selectedUserId === processedMessage.senderID || selectedUserId === processedMessage.recipientID;
        const isAdminSenderInCurrentChat = processedMessage.senderID === currentAdmin?.user?.id && processedMessage.recipientID === selectedUserId;

        if (isRelevantToCurrentChat || isAdminSenderInCurrentChat) {
          dispatch({ type: CHAT_ACTIONS.SOCKET_MESSAGE_RECEIVED, payload: processedMessage });
        }
        // Luôn cập nhật conversations để hiển thị unread count hoặc last message
        dispatch(getConversations());
      };

      const handleChatHistory = (messagesFromServer) => {
        if (Array.isArray(messagesFromServer)) {
          const processedMessages = messagesFromServer.map(msg => ({
            ...msg,
            _id: msg._id || msg.id || `hist_${Date.now()}_${Math.random()}`,
            createdAt: msg.createdAt || msg.createdDate || new Date().toISOString(),
            sender: msg.sender || msg.senderRole || (msg.senderID === currentAdmin?.user?.id ? 'admin' : (msg.senderID ? 'user' : '')),
            senderRole: msg.senderRole || (msg.senderID === currentAdmin?.user?.id ? 'admin' : (msg.senderID ? 'user' : '')),
          }));
          dispatch({ type: CHAT_ACTIONS.GET_MESSAGES_SUCCESS, payload: processedMessages });
        }
      };

      // Xử lý typing indicator từ người dùng
      const handleUserTyping = (data) => { // data: { userId: string, isTyping: boolean, senderId: string }
        if (data.senderId !== currentAdmin?.user?.id) { // Chỉ xử lý nếu không phải admin tự gửi
          dispatch({
            type: CHAT_ACTIONS.SET_USER_TYPING,
            payload: { userId: data.senderId, isTyping: data.isTyping }
          });
        }
      };

      socket.on('new-message', handleNewMessage);
      socket.on('chat-history', handleChatHistory);
      socket.on('typing-indicator', handleUserTyping); // Lắng nghe user typing

      return () => {
        socket.off('new-message', handleNewMessage);
        socket.off('chat-history', handleChatHistory);
        socket.off('typing-indicator', handleUserTyping);
      };
    }
  }, [dispatch, selectedUserId, currentAdmin?.user?.id]);


  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget title="Trò chuyện với khách hàng" noBodyPadding>
          <Box className={classes.root}>
            <Box className={classes.chatContainer}>
              {/* Contacts List */}
              <Box className={classes.contactsList}>
                <Box className={classes.searchBox}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm khách hàng..."
                    value={searchKey}
                    onChange={handleSearchChange}
                    InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }}
                  />
                </Box>
                <PerfectScrollbar className={classes.scrollArea} options={{ suppressScrollX: true }}>
                  <List>
                    {loading && contacts.length === 0 ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>
                    ) : filteredContacts.length === 0 ? (
                      <Box sx={{ p: 2, textAlign: 'center' }}><Typography variant="body2">Không tìm thấy khách hàng</Typography></Box>
                    ) : (
                      filteredContacts.map((contact) => {
                        const conversation = Array.isArray(conversations) ?
                          conversations.find(c => c.participants && Array.isArray(c.participants) && c.participants.some(p => p === contact._id || p?._id === contact._id)) :
                          undefined;
                        const lastMessage = conversation?.lastMessage || {};
                        const unreadCount = conversation?.unreadCount || 0;

                        return (
                          <ListItem
                            key={contact._id}
                            className={classNames(classes.contactItem, { [classes.selectedContact]: selectedUserId === contact._id })}
                            onClick={() => handleContactClick(contact._id)}
                            divider
                            button // Thêm thuộc tính button cho hiệu ứng click
                          >
                            <ListItemAvatar>
                              <Badge color="primary" variant="dot" invisible={!contact.isOnline}>
                                <Avatar src={contact.avatar}>{contact.displayName?.[0]?.toUpperCase() || contact.email?.[0]?.toUpperCase() || 'U'}</Avatar>
                              </Badge>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Typography variant="body1" noWrap sx={{ maxWidth: 'calc(100% - 30px)' }}>{contact.displayName || contact.email}</Typography>
                                  {unreadCount > 0 && (<Badge badgeContent={unreadCount} color="error" />)}
                                </Box>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography component="span" variant="body2" color="textPrimary" noWrap sx={{ width: 180, display: 'inline-block', opacity: lastMessage.message ? 1 : 0.6 }}>
                                    {lastMessage.message ? lastMessage.message : 'Chưa có tin nhắn'}
                                  </Typography>
                                  {lastMessage.createdAt && (
                                    <Typography component="span" variant="caption" color="textSecondary" sx={{ display: 'block', opacity: 0.8 }}>
                                      {moment(lastMessage.createdAt).fromNow()}
                                    </Typography>
                                  )}
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        );
                      })
                    )}
                  </List>
                </PerfectScrollbar>
              </Box>

              {/* Message Area */}
              <Box className={classes.messageArea}>
                {selectedUserId ? (
                  <>
                    <Box className={classes.chatHeader}>
                      <Avatar src={selectedUser?.avatar} style={{ marginRight: 10 }}>{selectedUser?.displayName?.[0]?.toUpperCase() || selectedUser?.email?.[0]?.toUpperCase() || 'U'}</Avatar>
                      <Box>
                        <Typography variant="subtitle1">{selectedUser?.displayName || selectedUser?.email || 'Người dùng'}</Typography>
                        {/* Có thể thêm trạng thái online/offline của selectedUser ở đây nếu có */}
                      </Box>
                    </Box>
                    <PerfectScrollbar
                      // Gán ref cho PerfectScrollbar để có thể điều khiển cuộn
                      containerRef={ref => { messageContainerRef.current = ref; }}
                      className={classes.messageContainer}
                      options={{ suppressScrollX: true }}
                    >
                      <Box className={classes.messagesWrapper}>
                        {/* Hiển thị loading khi đang tải tin nhắn cho user mới chọn và chưa có tin nhắn */}
                        {loading && messages.length === 0 && chatState.loadingMessages ? ( // Thêm một state loadingMessages riêng nếu cần
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, flexGrow: 1, alignItems: 'center' }}><CircularProgress size={30} /></Box>
                        ) : messages.length === 0 ? (
                          <Box sx={{ textAlign: 'center', p: 2, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</Typography>
                          </Box>
                        ) : (
                          messages.map((message) => (
                            <Box
                              key={message._id} // Đảm bảo _id là unique
                              className={
                                message.senderID === currentAdmin?.user?.id
                                  ? classes.messageRight
                                  : classes.messageLeft
                              }
                            >
                              <Typography variant="body2" sx={{ opacity: message.isTemp ? 0.7 : 1 }}>
                                {message.message}
                              </Typography>
                              <Typography variant="caption" className={classes.messageTime}>
                                {moment(message.createdAt).format('HH:mm DD/MM/YYYY')}
                                {message.isTemp && " (Đang gửi...)"}
                              </Typography>
                            </Box>
                          ))
                        )}
                        {/* Hiển thị "User is typing..." */}
                        {isUserTyping && (
                          <Box className={classes.typingIndicator} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                              {selectedUser?.displayName || 'Khách'} đang nhập...
                            </Typography>
                          </Box>
                        )}
                        {/* Div ảo để scrollIntoView có thể trỏ tới (nếu dùng cách đó) */}
                        <div ref={messagesEndRef} style={{ height: '1px' }} />
                      </Box>
                    </PerfectScrollbar>
                    <Box className={classes.inputArea}>
                      <TextField
                        inputRef={messageInputRef} // Gán ref cho ô input
                        className={classes.messageInput}
                        variant="outlined"
                        size="small"
                        placeholder="Nhập tin nhắn..."
                        value={messageInput}
                        onChange={handleMessageInputChange}
                        onKeyPress={handleKeyPress}
                        fullWidth
                        multiline
                        maxRows={3}
                        disabled={!selectedUserId || (loading && messages.length === 0)} // Disable nếu chưa chọn user hoặc đang load tin nhắn ban đầu
                      />
                      <IconButton color="primary" disabled={!selectedUserId}>
                        <AttachFileIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || !selectedUserId}
                      >
                        Gửi
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box className={classes.noConversationSelected}>
                    <Typography variant="h6">Chọn một cuộc trò chuyện để bắt đầu</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Widget>
      </Grid>
    </Grid>
  );
}

export default React.memo(ChatAdmin);