import React, { useState } from "react";
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import PasswordIcon from '@mui/icons-material/Password'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';


import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUserAPI, updateUserAPI } from '~/redux/user/userSlice'


function SecurityTab() {
  const dispatch = useDispatch()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  // const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault()

  // Ôn lại: https://www.npmjs.com/package/material-ui-confirm
  const confirmChangePassword = useConfirm()
  const submitChangePassword = (data) => {
    confirmChangePassword({
      // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LogoutIcon sx={{ color: 'warning.dark' }} /> Change Password
      </Box>,
      description: 'Bạn phải đăng nhập lại sau khi đổi mật khẩu thành công. Tiếp tục?',
      confirmationText: 'Xác nhận',
      cancellationText: 'Hủy bỏ'
    }).then(() => {
      const { current_password, new_password } = data

      // Gọi API...
      toast.promise(
        dispatch(updateUserAPI({ current_password, new_password })),
        { pending: 'Đang đăng nhập...' }
      ).then(res => {
        if (!res.error) {
          toast.success('Đã thay đổi mật khẩu thành công, vui lòng đăng nhập lại!')
          dispatch(logoutUserAPI(false))
        }
      })


    }).catch(() => { })
  }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
        <Box>
          <Typography variant="h5">Bảng điều khiển bảo mật</Typography>
        </Box>
        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                label="Current Password"
                type={showCurrentPass ? 'text' : 'password'}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showCurrentPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...register('current_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['current_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'current_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Mật khẩu mới"
                type={showNewPass ? 'text' : 'password'}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPass(!showNewPass)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showNewPass ? <VisibilityOff /> : <Visibility />}

                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...register('new_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['new_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Xác nhận mật khẩu mới"
                type={showConfirmPass ? 'text' : 'password'}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                       {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...register('new_password_confirmation', {
                  validate: (value) => {
                    if (value === watch('new_password')) return true
                    return 'Password confirmation does not match.'
                  }
                })}
                error={!!errors['new_password_confirmation']}


              />

              <FieldErrorAlert errors={errors} fieldName={'new_password_confirmation'} />
            </Box>

            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth>
                Thay đổi
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default SecurityTab
