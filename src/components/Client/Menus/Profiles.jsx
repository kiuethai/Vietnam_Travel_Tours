import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import CardTravelIcon from '@mui/icons-material/CardTravel';
import Logout from '@mui/icons-material/Logout'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
import { Link } from 'react-router-dom'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  // console.log('currentUser: ', currentUser?.user?.avatar)
  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: 'Đăng xuất khỏi tài khoản của bạn?',
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    }).then(() => {
      // Gọi API đăng xuất người dùng
      dispatch(logoutUserAPI())
    }).catch(() => { })
  }

  const getAvatar = () => {
    if (!currentUser) return null;

    // Debug để tìm ra cấu trúc chính xác
    // console.log("Current user structure:", JSON.stringify(currentUser, null, 2));

    // Kiểm tra tất cả khả năng
    if (currentUser.user?.avatar) return currentUser.user.avatar;
    if (currentUser.avatar) return currentUser.avatar;
    if (currentUser.success && currentUser.user?.avatar) return currentUser.user.avatar;

    // Một số trường hợp đặc biệt khác
    return null;
  }
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-button-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 35, height: 35 }}
            alt={currentUser?.user?.displayName}
            src={getAvatar()}/>
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <Link to="/settings/account" style={{ color: 'inherit' }}>
          <MenuItem sx={{ '&:hover': { color: 'success.light' } }}>
            <Avatar
              sx={{ width: 28, height: 28, mr: 2 }}
              alt='Kieuthai'
              src={getAvatar()}

            /> Profile
          </MenuItem>
        </Link>
        <Divider />
        <Link to="/my-tour" style={{ color: 'inherit' }}>
          <MenuItem >
            <ListItemIcon>
              <CardTravelIcon fontSize="small" />
            </ListItemIcon>
            Tour đã đặt
          </MenuItem>
        </Link>
        <MenuItem onClick={handleLogout} sx={{
          '&:hover': {
            color: 'warning.dark',
            '& .logout-icon': { color: 'warning.dark' }
          }
        }}>
          <ListItemIcon>
            <Logout className='logout-icon' fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles