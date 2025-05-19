import { makeStyles } from '@mui/styles'


export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 200px)',
    overflow: 'hidden',
  },
  chatContainer: {
    display: 'flex',
    height: '100%',
  },
  contactsList: {
    width: 300,
    borderRight: '1px solid #e0e0e0',
    height: '100%',
    overflow: 'hidden',
  },
  messageArea: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  messageContainer: {
    flexGrow: 1,
    padding: '20px',
    overflow: 'auto',
  },
  inputArea: {
    display: 'flex',
    padding: '10px 20px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  messageInput: {
    flexGrow: 1,
    marginRight: '10px',
  },
  messageLeft: {
    backgroundColor: '#f0f0f0',
    padding: '10px 15px',
    borderRadius: '20px',
    maxWidth: '70%',
    marginBottom: '10px',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#4dabf5',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '20px',
    maxWidth: '70%',
    marginBottom: '10px',
    alignSelf: 'flex-end',
  },
  messagesWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
  },
  contactItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  selectedContact: {
    backgroundColor: '#e3f2fd',
  },
  searchBox: {
    padding: '10px',
    borderBottom: '1px solid #e0e0e0',
  },
  messageTime: {
    fontSize: '0.7rem',
    marginTop: '5px',
    textAlign: 'right',
    opacity: 0.7,
  },
  noConversationSelected: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#9e9e9e',
  },
  scrollArea: {
    height: 'calc(100% - 60px)',
  },
  chatHeader: {
    padding: '10px 20px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
  },
  typingIndicator: {
    padding: '5px 10px',
    color: '#666',
    fontStyle: 'italic',
    fontSize: '0.8rem',
  },
}))