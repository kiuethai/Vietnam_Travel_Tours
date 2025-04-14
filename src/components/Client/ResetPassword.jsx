import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// Material UI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Zoom from '@mui/material/Zoom';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import { resetPasswordAPI } from '~/apis';

// Import validators
import {
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators';
import FieldErrorAlert from '~/components/Client/Form/FieldErrorAlert';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [invalidToken, setInvalidToken] = useState(!email || !token);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
  const handleMouseDownPasswordConfirm = (event) => event.preventDefault();

  const submitResetPassword = (data) => {
    const { newPassword } = data;

    if (!email || !token) {
      setInvalidToken(true);
      return;
    }

    toast.promise(
      resetPasswordAPI({ email, token, newPassword }),
      { pending: 'Đang đặt lại mật khẩu...' }
    ).then(() => {
      navigate('/login?passwordReset=true');
    });
  };

  if (invalidToken) {
    return (
      <section className="pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-15">
              <MuiCard sx={{ minWidth: 380, maxWidth: 500, margin: '0 auto', padding: '2em' }}>
                <Alert severity="error">
                  Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.
                </Alert>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">
                      Yêu cầu liên kết mới
                    </Button>
                  </Link>
                </Box>
              </MuiCard>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="pt-120 pb-120"
      style={{
        backgroundSize: "cover",
        backgroundImage: "url('/assets/images/backgrounds/login-bg.jpg')",
        backgroundPosition: "center",
        position: "relative",
      }}
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
            <form onSubmit={handleSubmit(submitResetPassword)}>
              <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <MuiCard sx={{ minWidth: 380, maxWidth: 500, margin: '0 auto', padding: '2em' }}>
                  <Box sx={{
                    margin: '1em',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}><LockOpenIcon /></Avatar>
                  </Box>
                  <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h5" component="h1">Đặt lại mật khẩu</Typography>
                  </Box>
                  <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Typography variant="body1">
                      Nhập mật khẩu mới cho tài khoản <strong>{email}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ padding: '1em' }}>
                    <Box sx={{ marginTop: '1em' }}>
                      <TextField
                        fullWidth
                        label="Mật khẩu mới"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        error={!!errors['newPassword']}
                        {...register('newPassword', {
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
                      <FieldErrorAlert errors={errors} fieldName={'newPassword'} />
                    </Box>

                    <Box sx={{ marginTop: '1em' }}>
                      <TextField
                        fullWidth
                        label="Xác nhận mật khẩu mới"
                        type={showPasswordConfirm ? 'text' : 'password'}
                        variant="outlined"
                        error={!!errors['confirmPassword']}
                        {...register('confirmPassword', {
                          required: FIELD_REQUIRED_MESSAGE,
                          validate: (value) => {
                            if (value === watch('newPassword')) return true;
                            return 'Mật khẩu không khớp!';
                          }
                        })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPasswordConfirm}
                                onMouseDown={handleMouseDownPasswordConfirm}
                                edge="end"
                              >
                                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <FieldErrorAlert errors={errors} fieldName={'confirmPassword'} />
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
                      Đặt lại mật khẩu
                    </Button>
                  </CardActions>
                </MuiCard>
              </Zoom>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}