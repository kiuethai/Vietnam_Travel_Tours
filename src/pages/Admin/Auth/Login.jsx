import { React, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import FieldErrorAlert from '~/components/Client/Form/FieldErrorAlert'
import { loginAdminAPI } from '~/redux/admin/adminSlice'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import {
  TextField as Input,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import classnames from 'classnames';
import { Button } from '~/components/Admin/Wrappers/Wrappers';

// styles
import useStyles from './styles';


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [isForgot, setIsForgot] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const classes = useStyles();

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginAdminAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then(res => {
      console.log('Login response full object:', res);
      if (!res.error) navigate('/admin')
    })
  };

   const submitForgotPassword = (data) => {
      const { email } = data;
      toast.promise(
        requestPasswordResetAPI({ email }),
        { pending: 'Đang gửi yêu cầu đặt lại mật khẩu...' }
      ).then(() => {
        // Toast notification is already handled in the API function
           toast.success('Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.', { theme: 'colored' });
      });
    };

  return (
    <>
      {isForgot ? (
        <>
          {/* Form quên mật khẩu */}
          <form onSubmit={handleSubmit(submitForgotPassword)}>
            <Box sx={{ marginTop: '1em' }}>
              <Input
                autoFocus
                fullWidth
                label="Nhập email của bạn..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>
            <div className={classes.formButtons}>
              <Button
                type="submit"
                variant='contained'
                color='primary'
                size='large'
              >
                Send
              </Button>
              <Button
                color='primary'
                size='large'
                onClick={() => setIsForgot(false)}
                className={classes.forgetButton}
              >
                Back to login
              </Button>
            </div>
          </form>
        </>
      ) : (<>
        {/* From login */}
        < form onSubmit={handleSubmit(submitLogIn)}>
          <Box sx={{ marginTop: '1em' }}>
            <Input
              autoFocus
              fullWidth
              label="Enter Email..."
              type="text"
              variant="outlined"
              error={!!errors['email']}
              {...register('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                }
              })} />
            <FieldErrorAlert errors={errors} fieldName={'email'} />
          </Box>
          <Box sx={{ marginTop: '1em' }}>
            <Input
              fullWidth
              label="Enter Password..."
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              error={!!errors['password']}
              {...register('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FieldErrorAlert errors={errors} fieldName={'password'} />
          </Box>

          <div className={classes.formButtons}>
            <Button
              type="submit"
              variant='contained'
              color='primary'
              size='large'
            >
              Login
            </Button>

            <Button
              color='primary'
              size='large'
              onClick={() => setIsForgot(!isForgot)}
              className={classes.forgetButton}
            >
              Forgot Password?
            </Button>
          </div>
        </form >
      </>
      )
      }
    </>
  )
}
export default Login