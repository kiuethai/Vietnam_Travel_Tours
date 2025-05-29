import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentUser: null
}
// Các hành động gọi api( bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncdThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    // Check if this is a Google login
    if (data.googleAuth) {
      // Special handling for Google authentication
      const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login-google`, {
        credential: data.decodedToken
      });
      return response.data;
    } else {
      // Regular email/password login
      const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data);
      return response.data;
    }
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {

    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return response.data
  }
)

// Khởi tại một cái Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: Nơi xử lý  dữ liệu đồng bộ
  reducers: {},
  // ExtraReducer: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là cái responce.data trả về ở trên
      const user = action.payload
      // console.log('user',user)
      state.currentUser = user
      toast.success('Đăng nhập thành công !')
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /*
        - API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
        - Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login
      */
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      // console.log('🚀 ~ builder.addCase ~ user:', user)

      state.currentUser = user
      // console.log('🚀 ~ builder.addCase ~ state.currentUser :', state.currentUser )
    })
  }
})

// Action creators are generated for each case reducer function
// export const { } = userSlice.actions

// Selectors:
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
