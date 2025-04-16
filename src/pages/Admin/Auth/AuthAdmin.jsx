import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'

import {
  Grid,
  Tabs,
  Tab,
  TextField as Input,
  Typography,
} from '@mui/material';

// styles
import useStyles from './styles';

// logo
import logo from './logo.svg';
import google from '~/components/Admin/images/google.svg';

//components
import { Button } from '~/components/Admin/Wrappers/Wrappers';
import Login from './Login';
import Register from './Register';

const getGreeting = () => {
  const d = new Date();
  if (d.getHours() >= 4 && d.getHours() <= 12) {
    return 'Good Morning';
  } else if (d.getHours() >= 13 && d.getHours() <= 16) {
    return 'Good Day';
  } else if (d.getHours() >= 17 && d.getHours() <= 23) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

function AuthAdmin(props) {
  const location = useLocation();
  let classes = useStyles();
  const tab = new URLSearchParams(location.search).get('tab');

  let initialTab = parseInt(tab, 10);

  let [activeTabId, setActiveTabId] = useState(Number.isNaN(initialTab) ? 0 : initialTab);

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt='logo' className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>
          ADMIN KTTravel
        </Typography>
      </div>
      <div className={classes.formContainer} >
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor='primary'
            textColor='primary'
            centered
          >
            <Tab label='Login' classes={{ root: classes.tab }} />
            <Tab label='New User' classes={{ root: classes.tab }} />
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Typography variant='h1' className={classes.greeting}>
                {getGreeting()}, Admin
              </Typography>
              <Button
                size='large'
                className={classes.googleButton}
              /* Login */

              >
                <img
                  src={google}
                  alt='google'
                  className={classes.googleIcon}
                />
                &nbsp;Sign in with Google
              </Button>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>
                  or
                </Typography>
                <div className={classes.formDivider} />
              </div>
              {/* From login */}
              <Login />
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant='h1' className={classes.greeting}>
                Welcome!
              </Typography>
              <Typography variant='h2' className={classes.subGreeting}>
                Create your account
              </Typography>

              {/* From register */}
              <div>
                <Register />
              </div>
            </React.Fragment>
          )}

        </div>
      </div>

    </Grid >
  );
}

export default AuthAdmin
