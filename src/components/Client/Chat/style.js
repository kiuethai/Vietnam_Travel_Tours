import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
export const ChatButton = styled(IconButton)(({ theme }) => ({
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

export const ChatWindow = styled(Box)(({ theme }) => ({
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

export const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const MessageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}));

export const MessageBubble = styled(Box)(({ theme, isuser }) => ({
  maxWidth: '80%',
  padding: '10px 14px',
  borderRadius: isuser === 'true' ? '16px 16px 0 16px' : '16px 16px 16px 0',
  backgroundColor: isuser === 'true' ? theme.palette.primary.main : '#f1f0f0',
  color: isuser === 'true' ? '#fff' : '#000',
  alignSelf: isuser === 'true' ? 'flex-end' : 'flex-start',
  wordBreak: 'break-word',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
}));

export const MessageTime = styled(Typography)(({ theme, isuser }) => ({
  fontSize: '11px',
  color: isuser === 'true' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  marginTop: '4px',
  textAlign: isuser === 'true' ? 'right' : 'left',
}));

export const TypingIndicator = styled(Box)(({ theme }) => ({
  padding: '8px 12px',
  fontSize: '13px',
  color: 'rgba(0, 0, 0, 0.6)',
  fontStyle: 'italic',
  alignSelf: 'flex-start',
  backgroundColor: '#f1f0f0',
  borderRadius: '16px 16px 16px 0',
  marginBottom: '8px',
}));

export const InputArea = styled(Box)(({ theme }) => ({
  borderTop: '1px solid #e0e0e0',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));