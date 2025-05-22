import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import CircularProgress from '@mui/material/CircularProgress'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import SendIcon from '@mui/icons-material/Send'
import SearchIcon from '@mui/icons-material/Search'
import PerfectScrollbar from 'react-perfect-scrollbar'
import classNames from 'classnames'
import moment from 'moment'
import Widget from '~/components/Admin/Widget/Widget'
import {
  getContactUsers,
  getConversations,
  getMessages,
  sendMessage,
  selectConversation,
  initSocketConnection,
  disconnectSocketConnection
} from '~/redux/chat/chatApiFunctions'
import { selectCurrentAdmin } from '~/redux/admin/adminSlice'
import { useStyles } from './style'
import socketClient from '~/utils/socketChat'

// Debounce function để giảm số lần gọi API
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
  const classes = useStyles()
  const dispatch = useDispatch()
  const currentAdmin = useSelector(selectCurrentAdmin)
  const chatState = useSelector((state) => state.chat)
  const [messageInput, setMessageInput] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  // Chỉ lưu trữ timeout ID trong ref để tránh re-render
  const typingTimeoutRef = useRef(null)
  const previousSelectedUserRef = useRef(null)

  // derive contacts, messages, loading, etc.
  const contacts = chatState?.contacts || []
  const messages = chatState?.messages || []
  const loading = chatState?.loading || false
  const selectedUserId = chatState?.selectedUserId
  const typingUsers = chatState?.typingUsers || {}
  const conversations = chatState?.conversations || []

  // Tạo debouncedSearch để giảm số lần filter contacts khi tìm kiếm
  const [debouncedSearchKey, setDebouncedSearchKey] = useState(searchKey)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchKey(searchKey);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchKey]);

  // Khởi tạo socket và dữ liệu ban đầu
  useEffect(() => {
    // Load contacts and conversations only once when component mounts
    dispatch(getContactUsers())
    dispatch(getConversations())

    // Initialize socket connection if the admin is logged in
    if (currentAdmin?.user?.id) {
      dispatch(initSocketConnection(currentAdmin?.accessToken))
    }

    // Cleanup socket connection when component unmounts
    return () => {
      dispatch(disconnectSocketConnection())
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [dispatch, currentAdmin?.user?.id])

  // Memoize scroll effect to prevent unnecessary calls
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  // Memoize the sendTypingIndicator to prevent recreation on each render
  const sendTypingIndicator = useCallback((userId, isTypingStatus) => {
    const socket = socketClient.getSocket()
    if (socket && socket.connected) {
      socketClient.sendTypingIndicator({
        userId,
        isTyping: isTypingStatus
      })
    }
  }, [])

  // Handle selected conversation changes
  useEffect(() => {
    // Only fetch messages if the selected user has changed
    if (selectedUserId && selectedUserId !== previousSelectedUserRef.current) {
      console.log('Selected new user, fetching messages:', selectedUserId);
      dispatch(getMessages(selectedUserId));
      previousSelectedUserRef.current = selectedUserId;
    }
  }, [selectedUserId, dispatch]);

  const handleContactClick = useCallback((userId) => {
    dispatch(selectConversation(userId))
  }, [dispatch])

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim() && selectedUserId) {
      dispatch(sendMessage({
        recipientID: selectedUserId,
        message: messageInput.trim(),
        attachments: []
      }))

      // Clear the typing indicator when sending a message
      sendTypingIndicator(selectedUserId, false)

      // Reset input and typing state
      setMessageInput('')
      setIsTyping(false)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [messageInput, selectedUserId, dispatch, sendTypingIndicator])

  // Debounced typing indicator handler
  const debouncedTypingHandler = useCallback(
    debounce((isTypingState, userId) => {
      sendTypingIndicator(userId, isTypingState)
    }, 500),
    [sendTypingIndicator]
  )

  const handleMessageInputChange = useCallback((e) => {
    setMessageInput(e.target.value)

    if (selectedUserId) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Send typing indicator only if state changed
      if (!isTyping) {
        setIsTyping(true)
        debouncedTypingHandler(true, selectedUserId)
      }

      // Set a timeout to clear typing indicator after inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        debouncedTypingHandler(false, selectedUserId)
      }, 2000)
    }
  }, [selectedUserId, isTyping, debouncedTypingHandler])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const handleSearchChange = useCallback((e) => {
    setSearchKey(e.target.value)
  }, [])

  // Memoize filtered contacts để tránh tính toán lại trên mỗi render
  const filteredContacts = React.useMemo(() => {
    const contactsList = Array.isArray(contacts) ? contacts : []
    if (!debouncedSearchKey) return contactsList

    return contactsList.filter(contact =>
      contact.displayName?.toLowerCase().includes(debouncedSearchKey.toLowerCase()) ||
      contact.email?.toLowerCase().includes(debouncedSearchKey.toLowerCase())
    )
  }, [contacts, debouncedSearchKey])

  const selectedUser = React.useMemo(() => {
    const contactsList = Array.isArray(contacts) ? contacts : []
    return contactsList.find(contact => contact._id === selectedUserId)
  }, [contacts, selectedUserId])

  const isUserTyping = typingUsers[selectedUserId] || false
  useEffect(() => {
    console.log('Messages in ChatAdmin:', messages);
  }, [messages]);

  // Thêm useEffect để debug
  useEffect(() => {
    // Log chi tiết từng tin nhắn để phân tích
    const adminMessages = messages.filter(msg =>
      msg.sender === 'admin' || msg.senderRole === 'admin'
    );

    const userMessages = messages.filter(msg =>
      msg.sender === 'user' || msg.senderRole === 'user'
    );

    console.log('Admin messages:', adminMessages.length);
    console.log('User messages:', userMessages.length);
    console.log('Total messages:', messages.length);

    // In ra các ID để debug
    console.log('User message recipient IDs:',
      userMessages.map(m => `${m.recipientID}`).join(', '));
    console.log('Admin ID:', currentAdmin?.user?.id);

    // Kiểm tra các thuộc tính của tin nhắn để xác định lỗi
    if (userMessages.length > 0) {
      console.log('Sample user message:', userMessages[0]);
    }
  }, [messages, currentAdmin?.user?.id]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget
          title="Trò chuyện với khách hàng"
          noBodyPadding
        >
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
                    InputProps={{
                      startAdornment: <SearchIcon fontSize="small" />
                    }}
                  />
                </Box>
                <PerfectScrollbar className={classes.scrollArea}>
                  <List>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : filteredContacts.length === 0 ? (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2">Không tìm thấy khách hàng</Typography>
                      </Box>) : (
                      filteredContacts.map((contact) => {
                        // Safely check if conversations exists and has the expected structure
                        const conversation = Array.isArray(conversations) ?
                          conversations.find(c => c.participants && Array.isArray(c.participants) && c.participants.includes(contact._id)) :
                          undefined;
                        const lastMessage = conversation?.lastMessage || {};
                        const unreadCount = conversation?.unreadCount || 0;

                        return (
                          <ListItem
                            key={contact._id}
                            className={classNames(
                              classes.contactItem,
                              { [classes.selectedContact]: selectedUserId === contact._id }
                            )}
                            onClick={() => handleContactClick(contact._id)}
                            divider
                          >
                            <ListItemAvatar>
                              <Badge
                                color="primary"
                                variant="dot"
                                invisible={!contact.isOnline}
                              >
                                <Avatar src={contact.avatar}>
                                  {contact.displayName?.[0] || contact.email?.[0] || 'U'}
                                </Avatar>
                              </Badge>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="body1">
                                    {contact.displayName || contact.email}
                                  </Typography>
                                  {unreadCount > 0 && (
                                    <Badge badgeContent={unreadCount} color="primary" />
                                  )}
                                </Box>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="textPrimary"
                                    noWrap
                                    style={{ width: 180, display: 'inline-block' }}
                                  >
                                    {lastMessage.message || 'Chưa có tin nhắn'}
                                  </Typography>
                                  {lastMessage.createdAt && (
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="textSecondary"
                                      style={{ display: 'block' }}
                                    >
                                      {moment(lastMessage.createdAt).format('HH:mm DD/MM/YYYY')}
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
                      <Avatar src={selectedUser?.avatar} style={{ marginRight: 10 }}>
                        {selectedUser?.displayName?.[0] || selectedUser?.email?.[0] || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {selectedUser?.displayName || selectedUser?.email || 'Người dùng'}
                        </Typography>

                      </Box>
                    </Box>
                    <PerfectScrollbar className={classes.messageContainer}>
                      <Box className={classes.messagesWrapper}>
                        {/* Debug information - remove in production */}
                        {process.env.NODE_ENV !== 'production' && (
                          <Box sx={{
                            p: 1,
                            mb: 2,
                            fontSize: '10px',
                            border: '1px dashed #ccc',
                            borderRadius: 1,
                            backgroundColor: '#f5f5f5'
                          }}>
                            <details>
                              <summary>
                                <Typography variant="caption">
                                  Debug: {messages.length} messages, selected user: {selectedUserId}
                                </Typography>
                              </summary>
                              <Box sx={{ maxHeight: '100px', overflow: 'auto' }}>
                                <pre style={{ fontSize: '9px' }}>
                                  {JSON.stringify(messages[0] || {}, null, 2)}
                                </pre>
                              </Box>
                            </details>
                          </Box>
                        )}

                        {/* Regular message display */}
                        {loading ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                          </Box>
                        ) : messages.length === 0 ? (
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="body2">
                              Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                            </Typography>
                          </Box>
                        ) : (
                          messages.map((message, index) => (
                            <Box
                              key={message._id || index}
                              className={
                                message.sender === 'admin' ||
                                  message.senderRole === 'admin' ||
                                  message.senderID === currentAdmin?.user?.id
                                  ? classes.messageRight
                                  : classes.messageLeft
                              }
                            >
                              <Typography variant="body2">{message.message}</Typography>
                              <Typography variant="caption" className={classes.messageTime}>
                                {moment(message.createdAt || message.createdDate).format('HH:mm DD/MM/YYYY')}
                              </Typography>
                            </Box>
                          ))
                        )}
                        {isUserTyping && (
                          <Box className={classes.typingIndicator}>
                            <Typography variant="body2">
                              {selectedUser?.displayName || selectedUser?.email || 'Người dùng'} đang nhập...
                            </Typography>
                          </Box>
                        )}
                        <div ref={messagesEndRef} />
                      </Box>
                    </PerfectScrollbar>
                    <Box className={classes.inputArea}>
                      <TextField
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
                      />
                      <IconButton color="primary">
                        <AttachFileIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                      >
                        Gửi
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box className={classes.noConversationSelected}>
                    <Typography variant="h6">
                      Chọn một cuộc trò chuyện để bắt đầu
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Widget>
      </Grid>
    </Grid>
  )
}

export default React.memo(ChatAdmin)