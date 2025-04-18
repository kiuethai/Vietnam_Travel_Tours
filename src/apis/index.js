import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'


/**APIs Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Tài khoản đã được tạo thành công! Vui lòng kiểm tra và xác minh tài khoản của bạn trước khi đăng nhập', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Tài khoản đã được xác minh thành công! Bây giờ bạn có thể Đặt ngay để tận hưởng dịch vụ của chúng tôi! Chúc bạn một ngày tốt lành!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}


export const requestPasswordResetAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/password-reset/request`, data)
  toast.success('Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.', { theme: 'colored' })
  return response.data
}

export const resetPasswordAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/password-reset/reset`, data)
  toast.success('Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.', { theme: 'colored' })
  return response.data
}

export const getAllUsersAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/getAllUsers`)
  return response.data
}


export const UpdateUserAPI = async (userId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/${userId}`, data)
  toast.success('Cập nhật thông tin tài khoản thành công!', { theme: 'colored' })
  return response.data
}


/* APIs Admin */

export const registerAdminAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/admin/register`, data)
  toast.success('Tài khoản đã được tạo thành công! Vui lòng kiểm tra và xác minh tài khoản của bạn trước khi đăng nhập', { theme: 'colored' })
  return response.data
}

export const verifyAdminAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/admin/verify`, data)
  toast.success('Tài khoản đã được xác minh thành công! Bây giờ bạn có thể Đặt ngay để tận hưởng dịch vụ của chúng tôi! Chúc bạn một ngày tốt lành!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAdminAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/admin/refresh_token`)
  return response.data
}

/* APIs Tours */

// export const getAllToursAPI = async () => {
//   const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/tours/getAllTours`)
//   return response.data
// }

export const addTourApi = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/tours/addTour`, data)
  toast.success('Thêm tour thành công!', { theme: 'colored' })
  return response.data
}

export const addItineraryApi = async (tourId, data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/tours/${tourId}/itinerary`,data )
  toast.success('Thêm lịch trình thành công!', { theme: 'colored' })
  return response.data
}