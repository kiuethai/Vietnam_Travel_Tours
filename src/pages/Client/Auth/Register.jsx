import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Zoom from '@mui/material/Zoom';
import { useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import { registerUserAPI } from '~/apis'

import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'

// Simple FieldErrorAlert component if not available
const FieldErrorAlert = ({ errors, fieldName }) => {
  if (!errors[fieldName]) return null;
  return (
    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
      {errors[fieldName].message}
    </Typography>
  );
};

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  
  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
  const handleMouseDownPasswordConfirm = (event) => event.preventDefault();

  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      { pending: 'Registration is in progress...' }
    ).then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  };

  return (
    <section
      className="pt-120 pb-120"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-120">
            <form onSubmit={handleSubmit(submitRegister)}>
              <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <MuiCard sx={{ minWidth: 580, maxWidth: 280, p: 5, borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                  <Box sx={{
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}><LockIcon /></Avatar>
                    <Typography component="h1" variant="h5">Tạo tài khoản của bạn</Typography>
                  </Box>
                  

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
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

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Password"
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

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      variant="outlined"
                      error={!!errors['confirmPassword']}
                      {...register('confirmPassword', {
                        required: FIELD_REQUIRED_MESSAGE,
                        validate: (value) => {
                          if (value === watch('password')) return true;
                          return 'Passwords do not match!';
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

                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register('agreeTerms', { required: 'You must agree to the terms' })}
                        />
                      }
                      label={<>Tôi đồng ý với <Link to="#" style={{ color: '#38b5fe' }}>Điều khoản & Điều kiện</Link></>}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'agreeTerms'} />
                  </Box>

                  <CardActions sx={{ p: 0, mb: 2 }}>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ bgcolor: '#38b5fe' }}
                    >
                      Register
                    </Button>
                  </CardActions>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography>Bạn đã có tài khoản?</Typography>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                      <Typography sx={{ color: '#38b5fe', '&:hover': { color: '#ffbb39' } }}>Đăng nhập</Typography>
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