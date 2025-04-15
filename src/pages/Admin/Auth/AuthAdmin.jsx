import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { loginAdminAPI } from '~/redux/admin/adminSlice'


import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'

import Box from '@mui/material/Box';
import {
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Grow,
  TextField as Input,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import classnames from 'classnames';

// styles
import useStyles from './styles';

// logo
import logo from './logo.svg';
import google from '~/components/Admin/images/google.svg';

// context
import {
  useUserDispatch,
  loginUser,
  registerUser,
  sendPasswordResetEmail,
} from '~/context/UserContext';


import { receiveToken, doInit } from '~/context/UserContext';

//components
import { Button } from '~/components/Admin/Wrappers/Wrappers';
import Widget from '~/components/Admin/Widget/Widget';
import config from '~/config';
import Login from './Login';


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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  let classes = useStyles();
  const tab = new URLSearchParams(location.search).get('tab');
  // global
  let userDispatch = useUserDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      receiveToken(token, userDispatch);
      doInit()(userDispatch);
    }
  }, []); // eslint-disable-line

  // local
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState(null);
  let initialTab = parseInt(tab, 10);

  let [activeTabId, setActiveTabId] = useState(Number.isNaN(initialTab) ? 0 : initialTab); let [nameValue, setNameValue] = useState('');


  let [loginValue, setLoginValue] = useState('');
  let [passwordValue, setPasswordValue] = useState('');
  let [forgotEmail, setForgotEmail] = useState('');

  // let [isForgot, setIsForgot] = useState(false);

  let isLoginFormValid = () => {
    return loginValue.length !== 0 && passwordValue.length !== 0;
  };

  let loginOnEnterKey = (event) => {
    if (event.key === 'Enter' && isLoginFormValid()) {
      loginUser(
        userDispatch,
        loginValue,
        passwordValue,
        props.history,
        setIsLoading,
        setError,
      );
    }
  };

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginAdminAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then(res => {
      console.log('Login response full object:', res);
      if (!res.error) navigate('/')
    })
  };



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
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                        'google',
                      )
                    }
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
                  <Login  />
               
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
                  <Grow in={error}>
                    <Typography className={classes.errorMessage}>
                      Something is wrong with your login or password :(
                    </Typography>
                  </Grow>
                  <Input
                    id='name'
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    margin='normal'
                    placeholder='Full Name'
                    type='email'
                    fullWidth
                  />
                  <Input
                    id='email'
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={loginValue}
                    onChange={(e) => setLoginValue(e.target.value)}
                    margin='normal'
                    placeholder='Email Adress'
                    type='email'
                    fullWidth
                  />
                  <Input
                    id='password'
                    InputProps={{
                      classes: {
                        underline: classes.InputUnderline,
                        input: classes.Input,
                      },
                    }}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    margin='normal'
                    placeholder='Password'
                    type='password'
                    fullWidth
                  />
                  <div className={classes.creatingButtonContainer}>
                    {isLoading ? (
                      <CircularProgress size={26} />
                    ) : (
                      <Button
                        onClick={() =>
                          registerUser(
                            userDispatch,
                            loginValue,
                            passwordValue,
                            props.history,
                            setIsLoading,
                            setError,
                          )()
                        }
                        disabled={
                          loginValue.length === 0 ||
                          passwordValue.length === 0 ||
                          nameValue.length === 0
                        }
                        size='large'
                        variant='contained'
                        color='primary'
                        fullWidth
                        className={classes.createAccountButton}
                      >
                        Create your account
                      </Button>
                    )}
                  </div>
                  <div className={classes.formDividerContainer}>
                    <div className={classes.formDivider} />
                    <Typography className={classes.formDividerWord}>
                      or
                    </Typography>
                    <div className={classes.formDivider} />
                  </div>
                  <Button
                    size='large'
                    className={classnames(
                      classes.googleButton,
                      classes.googleButtonCreating,
                    )}
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                        'google',
                      )
                    }
                  >
                    <img
                      src={google}
                      alt='google'
                      className={classes.googleIcon}
                    />
                    &nbsp;Sign in with Google
                  </Button>
                </React.Fragment>
              )}
          
        </div>
      </div>

    </Grid >
  );
}

export default AuthAdmin
