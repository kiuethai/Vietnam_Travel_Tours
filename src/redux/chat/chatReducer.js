import { CHAT_ACTIONS } from './chatTypes';

const initialState = {
  contacts: [],
  conversations: [],
  messages: [],
  selectedUserId: null,
  loading: false,
  error: null,
  socketConnected: false,
  typingUsers: {},
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    // Contact users
    case CHAT_ACTIONS.GET_CONTACTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CHAT_ACTIONS.GET_CONTACTS_SUCCESS:
      return {
        ...state,
        contacts: action.payload,
        loading: false
      };
    case CHAT_ACTIONS.GET_CONTACTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Conversations
    case CHAT_ACTIONS.GET_CONVERSATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CHAT_ACTIONS.GET_CONVERSATIONS_SUCCESS:
      return {
        ...state,
        conversations: action.payload,
        loading: false
      };
    case CHAT_ACTIONS.GET_CONVERSATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Messages
    case CHAT_ACTIONS.GET_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CHAT_ACTIONS.GET_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.payload,
        loading: false
      };
    case CHAT_ACTIONS.GET_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Send message
    case CHAT_ACTIONS.SEND_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CHAT_ACTIONS.SEND_MESSAGE_SUCCESS:
      // Check if this is a temporary message or a confirmation from the server
      if (action.payload.isTemp) {
        // Add temporary message to the message list
        return {
          ...state,
          messages: [...state.messages, action.payload],
          loading: false
        };
      } else {
        // This is a confirmed message from server
        // Check if we already have a temporary version of this message
        const existingTempIndex = state.messages.findIndex(
          m => m.isTemp && m.message === action.payload.message && 
          m._id.includes('temp_')
        );
        
        if (existingTempIndex >= 0) {
          // Replace temporary message with confirmed one
          return {
            ...state,
            messages: [
              ...state.messages.slice(0, existingTempIndex),
              action.payload,
              ...state.messages.slice(existingTempIndex + 1)
            ],
            loading: false
          };
        } else {
          // No temporary message found, just add the new one
          return {
            ...state,
            messages: [...state.messages, action.payload],
            loading: false
          };
        }
      }
    case CHAT_ACTIONS.SEND_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Select conversation
    case CHAT_ACTIONS.SELECT_CONVERSATION:
      return {
        ...state,
        selectedUserId: action.payload
      };

    // Socket related actions
    case CHAT_ACTIONS.SOCKET_INIT:
      return {
        ...state,
        socketConnected: action.payload
      };
    case CHAT_ACTIONS.SOCKET_MESSAGE_RECEIVED: {
        // Log để debug
        console.log('Tin nhắn nhận được trong reducer:', {
          message: action.payload,
          selectedUserId: state.selectedUserId
        });

        // Xử lý đặc biệt cho trường hợp client chat với admin
        const isAdminChat = state.selectedUserId === 'admin' || action.payload.recipientID === 'admin' || action.payload.senderRole === 'admin';
        
        // Kiểm tra xem tin nhắn có liên quan đến cuộc trò chuyện hiện tại không
        const isRelevantMessage = (
          // Trường hợp 1: Chat giữa client và admin
          isAdminChat ||
          
          // Trường hợp 2: Tin nhắn gửi đến người dùng đang được chọn
          action.payload.recipientID === state.selectedUserId ||
          
          // Trường hợp 3: Tin nhắn từ người dùng đang được chọn
          action.payload.senderID === state.selectedUserId
        );

        // Thêm tin nhắn vào state nếu nó liên quan đến cuộc trò chuyện hiện tại
        if (isRelevantMessage) {
          // Kiểm tra tin nhắn đã tồn tại chưa để tránh trùng lặp
          const messageExists = state.messages.some(m => 
            // So sánh ID nếu không phải tin nhắn tạm thời
            (m._id === action.payload._id && !m._id.includes('temp_')) ||
            // Hoặc nội dung giống nhau và thời gian tạo gần nhau (trong vòng 5 giây)
            (m.message === action.payload.message && 
             m.senderID === action.payload.senderID &&
             Math.abs(new Date(m.createdAt) - new Date(action.payload.createdAt)) < 5000)
          );

          if (messageExists) {
            // Nếu tin nhắn đã tồn tại nhưng được đánh dấu là tạm thời,
            // thay thế bằng tin nhắn thật từ server
            if (state.messages.some(m => 
                m.message === action.payload.message && 
                m.senderID === action.payload.senderID && 
                m.isTemp)) {
              return {
                ...state,
                messages: state.messages.map(m => 
                  (m.message === action.payload.message && 
                   m.senderID === action.payload.senderID && 
                   m.isTemp) ? { ...action.payload, isTemp: false } : m
                )
              };
            }
            // Nếu không phải tin nhắn tạm thời thì không cần thêm vào
            return state;
          }

          // Thêm tin nhắn mới vào danh sách
          return {
            ...state,
            messages: [...state.messages, action.payload]
          };
        }
        return state;
      }
    case CHAT_ACTIONS.SOCKET_READ_RECEIPT:
      // Update read status of messages
      return {
        ...state,
        messages: state.messages.map(message => {
          if (action.payload.messageIds.includes(message._id)) {
            return { ...message, readStatus: true };
          }
          return message;
        })
      };
      
    case CHAT_ACTIONS.SOCKET_TYPING:
      // Handle typing indicators
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.userId]: action.payload.isTyping,
          admin: action.payload.adminId === 'admin' && action.payload.isTyping
        }
      };

    default:
      return state;
  }
};

export default chatReducer;