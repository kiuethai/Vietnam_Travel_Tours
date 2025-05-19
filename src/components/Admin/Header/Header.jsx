import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentAdmin, logoutAdminAPI } from '~/redux/admin/adminSlice'
import { useConfirm } from 'material-ui-confirm'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import {
  Menu as MenuIcon,
  Person as AccountIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import classNames from 'classnames';

// styles
import useStyles from './styles';

// components
import { Typography, Avatar } from '~/components/Admin/Wrappers/Wrappers';

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from '~/context/LayoutContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
export default function Header(props) {
  let classes = useStyles();
  let theme = useTheme();
  const dispatch = useDispatch()
  const currentAdmin = useSelector(selectCurrentAdmin)
  const navigate = useNavigate()
  // global
  let layoutState = useLayoutState();
  let layoutDispatch = useLayoutDispatch();
  // local
  const [profileMenu, setProfileMenu] = useState(null);
  const [isSmall, setSmall] = useState(false);

  useEffect(function () {
    window.addEventListener('resize', handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
  });

  function handleWindowWidthChange() {
    let windowWidth = window.innerWidth;
    let breakpointWidth = theme.breakpoints.values.md;
    let isSmallScreen = windowWidth < breakpointWidth;
    setSmall(isSmallScreen);
  }
  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: 'Đăng xuất khỏi tài khoản của bạn?',
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy'
    }).then(async () => {
      // Gọi API đăng xuất người dùng
      const res = await dispatch(logoutAdminAPI())
      if (!res.error) navigate('/admin/login')
    }).catch(() => { })
  }
  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color='inherit'
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButton,
            classes.headerMenuButtonCollapse,
          )}
        >
          {(!layoutState.isSidebarOpened && isSmall) ||
            (layoutState.isSidebarOpened && !isSmall) ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse,
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant='h6' weight='medium' className={classes.logotype}>
          ADMIN KTTravel
        </Typography>
        <div className={classes.grow} />

        {/* <NotificationsActiveIcon /> */}
        < NotificationsIcon />
        <IconButton
          aria-haspopup='true'
          color='inherit'
          className={classes.headerMenuButton}
          aria-controls='profile-menu'
          onClick={(e) => setProfileMenu(e.currentTarget)}
        >
          <Avatar
            alt={currentAdmin?.user?.displayName}
            // eslint-disable-next-line no-mixed-operators
            src={currentAdmin?.user?.avatar}
            classes={{ root: classes.headerIcon }}
          >
            {currentAdmin?.user?.displayName?.[0]}
          </Avatar>
        </IconButton>
        <Typography
          block
          style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
        >
          <div className={classes.profileLabel}>Hi,&nbsp;</div>
          <Typography weight={'bold'} className={classes.profileLabel}>
            {currentAdmin?.user?.displayName}
          </Typography>
        </Typography>
        <Menu
          id='profile-menu'
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant='h4' weight='medium'>
              {currentAdmin?.user?.displayName}
            </Typography>

          </div>
          <MenuItem
            className={classNames(
              classes.profileMenuItem,
              classes.headerMenuItem,
            )}
          >
            <AccountIcon className={classes.profileMenuIcon} />
            <Link to='/admin/profile/account' style={{ textDecoration: 'none' }}>
              Profile
            </Link>
          </MenuItem>
          <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color='primary'
              onClick={handleLogout}
            >
              Sign Out
            </Typography>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
