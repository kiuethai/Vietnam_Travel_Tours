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
  Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import classnames from 'classnames';
import { Button } from '~/components/Admin/Wrappers/Wrappers';

// styles
import useStyles from './styles';

import google from '~/components/Admin/images/google.svg';
import { registerAdminAPI } from '~/apis';




function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  let classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
  const handleMouseDownPasswordConfirm = (event) => event.preventDefault();

  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerAdminAPI({ email, password }),
      { pending: 'Registration is in progress...' }
    ).then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  };


  return (
    <>
      <form onSubmit={handleSubmit(submitRegister)}>
      <Box sx={{ marginTop: '1em' }}>
          <Input
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

        <Box sx={{ marginTop: '1em' }}>
          <Input
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

        <Box sx={{ marginTop: '1em' }}>
          <Input
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

        <div className={classes.creatingButtonContainer}>
          <Button
            type="submit"
            size='large'
            variant='contained'
            color='primary'
            fullWidth
            className={classes.createAccountButton}
          >
           Tạo tài khoản của bạn
          </Button>

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
          
        >
          <img
            src={google}
            alt='google'
            className={classes.googleIcon}
          />
          &nbsp;Sign in with Google
        </Button>

      </form>
    </>
  )
}

export default Register