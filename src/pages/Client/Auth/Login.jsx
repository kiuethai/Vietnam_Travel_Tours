import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Material UI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Zoom from '@mui/material/Zoom';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { loginUserAPI } from '~/redux/user/userSlice'

// Import validators and other utilities
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators';
import FieldErrorAlert from '~/components/Client/Form/FieldErrorAlert';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const registeredEmail = searchParams.get('registeredEmail');
  const verifiedEmail = searchParams.get('verifiedEmail');

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then(res => {
      // console.log('Login response full object:', res);
      if (!res.error) navigate('/')
    })
  };

  return (
    <section
      className="pt-120 pb-120"

    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      />
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-15">
            <form onSubmit={handleSubmit(submitLogIn)}>
              <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <MuiCard sx={{ minWidth: 380, maxWidth: 500, margin: '0 auto', padding: '2em' }}>
                  <Box sx={{
                    margin: '1em',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
                  </Box>
                  <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h5" component="h1">Đăng nhập vào tài khoản của bạn</Typography>
                  </Box>
                  <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
                    {verifiedEmail && (
                      <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                        Your email&nbsp;
                        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>
                        &nbsp;đã được xác minh<br />Bây giờ bạn có thể đăng nhập để tận hưởng dịch vụ của chúng tôi! Chúc bạn một ngày tốt lành!
                      </Alert>
                    )}
                    {registeredEmail && (
                      <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                        An email has been sent to&nbsp;
                        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
                        <br />Vui lòng kiểm tra và xác minh tài khoản của bạn trước khi đăng nhập!
                      </Alert>
                    )}
                  </Box>
                  <Box sx={{ padding: '1em' }}>
                    <Box sx={{ marginTop: '1em' }}>
                      <TextField
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
                        })}
                      />
                      <FieldErrorAlert errors={errors} fieldName={'email'} />
                    </Box>
                    <Box sx={{ marginTop: '1em' }}>
                      <TextField
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
                    <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                        />
                        <label htmlFor="rememberMe" style={{ marginLeft: '8px', marginBottom: '0' }}>
                          Remember Me
                        </label>
                      </Box>
                      <Link to="/forgot-password">Quên mật khẩu?</Link>
                    </Box>
                  </Box>
                  <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{ background: "#38b5fe", '&:hover': { background: '#2a9fe0' } }}
                    >
                      Login
                    </Button>
                  </CardActions>
                  <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
                    <Typography>Bạn chưa có tài khoản?</Typography>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                      <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Đăng ký ngay</Typography>
                    </Link>
                  </Box>
                </MuiCard>
              </Zoom>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}