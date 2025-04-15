import React from "react";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// Material UI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LockResetIcon from '@mui/icons-material/LockReset';
import Typography from '@mui/material/Typography';
import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Zoom from '@mui/material/Zoom';
import { requestPasswordResetAPI } from '~/apis';

// Import validators
import {
  EMAIL_RULE,
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators';
import FieldErrorAlert from '~/components/Client/Form/FieldErrorAlert';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();

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
      <section
        className="pt-120 pb-120"
        style={{
          backgroundSize: "cover",
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
              <form onSubmit={handleSubmit(submitForgotPassword)}>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <MuiCard sx={{ minWidth: 380, maxWidth: 500, margin: '0 auto', padding: '2em' }}>
                    <Box sx={{
                      margin: '1em',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1
                    }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}><LockResetIcon /></Avatar>
                    </Box>
                    <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center' }}>
                      <Typography variant="h5" component="h1">Quên mật khẩu</Typography>
                    </Box>
                    <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                      <Typography variant="body1">
                        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.
                      </Typography>
                    </Box>
                    <Box sx={{ padding: '1em' }}>
                      <Box sx={{ marginTop: '1em' }}>
                        <TextField
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
                        Gửi liên kết đặt lại
                      </Button>
                    </CardActions>
                    <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                          <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Quay lại đăng nhập</Typography>
                        </Link>
                      </Box>
                    </Box>
                  </MuiCard>
                </Zoom>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Box>
  );
}