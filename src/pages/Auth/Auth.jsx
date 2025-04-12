import { useLocation, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Login from './Login'
import Register from './Register'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function Auth() {
  const location = useLocation()
  // console.log(location)
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'
  
  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to='/' replace={true} />
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundImage: "url('/assets/images/backgrounds/login-bg.jpg')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
    }}>
      {isLogin && <Login />}
      {isRegister && <Register />}
    </Box>
  )
}

export default Auth