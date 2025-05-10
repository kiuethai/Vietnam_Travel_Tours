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

export const getAllToursAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/tours/getAllTours`)
  return response.data
}

export const getTourByIdAPI = async (id) => {
  try {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/tours/${id}`);
    // console.log("API response data:", response.data);
    return response.data; 
  } catch (error) {
    // console.error("Error fetching tour:", error);
    throw error;
  }
};

export const addTourApi = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/tours/addTour`, data)
  toast.success('Thêm tour thành công!', { theme: 'colored' })
  return response.data
}

export const updateTourApi = async (tourId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/tours/updateTour/${tourId}`, data)
  toast.success('Cập nhật tour thành công!', { theme: 'colored' })
  return response.data
}

export const addItineraryApi = async (tourId, data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/tours/${tourId}/itinerary`, data)
  toast.success('Thêm lịch trình thành công!', { theme: 'colored' })
  return response.data
}


/* Contact tour APIS */

export const contactAdminAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/contact`, data)
  toast.success('Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi lại bạn trong thời gian sớm nhất.', { theme: 'colored' })
  return response.data
}

export const getAllContactAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/contact`)
  return response.data
}

export const replyUserAPI = async ( data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/contact/reply`, data)
  toast.success('Phản hồi thành công!', { theme: 'colored' })
  return response.data
}

/* Booking tour APIS */
export const addBookingTourApi = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/booking/create`, data)
  toast.success('Bạn đã đặt thành công tour', { theme: 'colored' })
  return response.data
}

export const getDataPaypal = async () => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/booking/payment/paypal`)
  return response.data
}

export const addMomoPayment = async (data) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/v1/booking/payment/momo`, data)
  return response.data
}

export const getTourBookingByUserId = async (userId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/booking/getUserTours/${userId}`)
  return response.data
}

export const getAllBookingsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/booking/getAllTourBooking`)
  return response.data
}

export const getTourBookingByBookingId = async (bookingId) => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/v1/booking/getTourByBookingId/${bookingId}`)
  return response.data
}

export const updateBookingApi = async (tourId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/booking/updateBooking/${tourId}`, data)
  toast.success('Cập nhật trạng thái booking thành công!', { theme: 'colored' })
  return response.data
}

export const sendInvoiceAPI = async (bookingId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/booking/sendInvoice/${bookingId}`)
  toast.success('Gửi hóa đơn thành công!', { theme: 'colored' })
  return response.data
}
/* Dashboad APIS */
export const getDashboardDataAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboard/domain_values`)
  return response.data
} 