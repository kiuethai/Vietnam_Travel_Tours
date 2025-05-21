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
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: false
      };
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
      // Show messages for the selected conversation more intelligently
      const currentAdminId = action.payload.senderID === state.selectedUserId ?
        action.payload.recipientID :
        (action.payload.recipientID === state.selectedUserId ? action.payload.senderID : null);

      // Log to help debug
      console.log('Message received in reducer:', {
        message: action.payload,
        selectedUserId: state.selectedUserId,
        isAdminMessage: currentAdminId !== null
      });

      // For admin chat, show all messages related to selected user
      const isRelevantForAdmin = (
        (action.payload.senderID === state.selectedUserId) ||
        (action.payload.recipientID === state.selectedUserId)
      );

      if (isRelevantForAdmin) {
        // Make sure we don't add duplicate messages
        const messageExists = state.messages.some(m => m._id === action.payload._id);

        if (messageExists) {
          return state;
        }

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

    default:
      return state;
  }
};

export default chatReducer;