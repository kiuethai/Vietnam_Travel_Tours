import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentAdmin: null
}
// Các hành động gọi api( bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncdThunk đi kèm với extraReducers
export const loginAdminAPI = createAsyncThunk(
  'admin/loginAdminAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/admin/login`, data)
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

export const logoutAdminAPI = createAsyncThunk(
  'admin/logoutAdminAPI',
  async (showSuccessMessage = true) => {
   
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/admin/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
      
    }
    return response.data
  }
)

export const  updateAdminAPI = createAsyncThunk(
  'admin/updateAdminAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/admin/update`, data)
    return response.data
  }
)

// Khởi tại một cái Slice trong kho lưu trữ - Redux Store
export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  // Reducers: Nơi xử lý  dữ liệu đồng bộ
  reducers: {},
  // ExtraReducer: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginAdminAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là cái responce.data trả về ở trên
      const admin = action.payload
      // console.log('admin',admin)
      state.currentAdmin = admin
      toast.success('Admin Đăng nhập thành công !')
    })
    builder.addCase(logoutAdminAPI.fulfilled, (state) => {
      /*
        - API logout sau khi gọi thành công thì sẽ clear thông tin currentAdmin về null ở đây
        - Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login
      */
      state.currentAdmin = null
    })
    builder.addCase(updateAdminAPI.fulfilled, (state, action) => {
      const admin = action.payload
      // console.log('🚀 ~ builder.addCase ~ admin:', admin)

      state.currentAdmin = admin
      console.log('🚀 ~ builder.addCase ~ state.currentAdmin :', state.currentAdmin )
    })
  }
})

// Action creators are generated for each case reducer function
// export const { } = adminSlice.actions

// Selectors:
export const selectCurrentAdmin = (state) => {
  return state.admin.currentAdmin
}


export const adminReducer = adminSlice.reducer
