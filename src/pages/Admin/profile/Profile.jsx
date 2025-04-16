import React from "react";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
// styles
import useStyles from "./styles";

import { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import SecurityIcon from '@mui/icons-material/Security'
import PersonIcon from '@mui/icons-material/Person'
import { Link, useLocation } from 'react-router-dom'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'

// Khai báo đống tabs ra biến const để dùng lại cho gọn
const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}
function Profile() {
  let classes = useStyles();
  let theme = useTheme();
  const location = useLocation()
  // Function đơn giản có nhiệm vụ lấy ra cái tab mặc định dựa theo url.
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.SECURITY)) return TABS.SECURITY
    return TABS.ACCOUNT
  }
  // State lưu trữ giá trị tab nào đang active
  const [activeTab, setActiveTab] = useState(getDefaultTab())

  // https://mui.com/material-ui/react-tabs
  const handleChangeTab = (event, selectedTab) => { setActiveTab(selectedTab) }
  return (
    <Grid container spacing={4}>
    
      <section
        className="pt-10 pb-220"
      >
        <Container disableGutters maxWidth={false} sx={{ alignItems: 'center', padding: '0 450px' }}>

          <TabContext value={activeTab} sx={{ alignItems: 'center'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab}>
                <Tab
                  label="Tài khoản"
                  value={TABS.ACCOUNT}
                  icon={<PersonIcon />}
                  iconPosition="start"
                  component={Link}
                  to="account" />
                <Tab
                  label="Bảo mật"
                  value={TABS.SECURITY}
                  icon={<SecurityIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/admin/profile/security" />
              </TabList>
            </Box>
            <TabPanel value={TABS.ACCOUNT}><AccountTab /></TabPanel>
            <TabPanel value={TABS.SECURITY}><SecurityTab /></TabPanel>
          </TabContext>

        </Container>
      </section>
   
    </Grid >
  );
}

// #######################################################################

export default Profile;
