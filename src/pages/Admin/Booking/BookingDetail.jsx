import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Divider,
  Avatar,
  Stack,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import SendIcon from '@mui/icons-material/Send';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaidIcon from '@mui/icons-material/Paid';

// Dữ liệu mẫu, thay bằng props hoặc fetch từ API
const invoice_booking = {
  title: 'Tour Đà Nẵng - Hội An',
  bookingDate: '2024-05-10',
  fullName: 'Nguyễn Văn A',
  address: 'thanh Xuân, Hà Nội',
  phoneNumber: '0123456789',
  email: 'neverforget989@gmail.com',
  checkoutId: 'HD123456',
  transactionId: 'GD987654',
  paymentDate: '2025-05-10',
  userId: 'user001',
  numAdults: 2,
  priceAdult: 1500000,
  numChildren: 1,
  priceChild: 1000000,
  destination: 'Hội An',
  paymentMethod: 'office-payment', // 'paypal-payment', 'office-payment'
  totalPrice: 4000000,
  amount: 4000000,
  startDate: '2025-05-15',
  bookingStatus: 'b', // 'b' = chưa xác nhận
  bookingId: 'BK001',
};

function formatCurrency(number) {
  return number.toLocaleString('vi-VN') + ' vnđ';
}

function getPaymentMethodIcon(method) {
  switch (method) {
    case 'momo-payment':
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src="../../assets/images/icons/icon_momo.png" alt="Momo" sx={{ width: 45, height: 45 }} />
          <Typography>Momo</Typography>
        </Stack>
      );
    case 'paypal-payment':
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src="../../assets/images/icons/icon_paypal.png" alt="Paypal" sx={{ width: 45, height: 45 }} />
          <Typography>Paypal</Typography>
        </Stack>
      );
    default:
      return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src="../../assets/images/icons/icon_office.png" alt="Office" sx={{ width: 45, height: 45 }} />
          <Chip label="Thanh toán tại văn phòng" color="info" size="small" />
        </Stack>
      );
  }
}

function BookingDetail() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        HÓA ĐƠN <Typography variant="subtitle1" component="span">đặt tour du lịch</Typography>
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src="../../assets/images/icons/icon_office.png" alt="Office" sx={{ width: 50, height: 50 }}/>
              <Typography variant="h5">{invoice_booking.title}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
            <Typography variant="subtitle2">
              Ngày: {new Date(invoice_booking.bookingDate).toLocaleDateString('vi-VN')}
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Từ</Typography>
            <Typography fontWeight="bold">{invoice_booking.fullName}</Typography>
            <Typography>{invoice_booking.address}</Typography>
            <Typography>Số điện thoại: {invoice_booking.phoneNumber}</Typography>
            <Typography>Email: {invoice_booking.email}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2">Đến</Typography>
            <Typography fontWeight="bold">Công ty KTTravel</Typography>
            <Typography>Thanh xuân</Typography>
            <Typography>Hà Nội</Typography>
            <Typography>Phone: 1 (804) 123-9876</Typography>
            <Typography>Email: hoangthiloan@gmail.com</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography><b>Mã hóa đơn #{invoice_booking.checkoutId}</b></Typography>
            <Typography><b>Mã giao dịch:</b> {invoice_booking.transactionId}</Typography>
            <Typography><b>Ngày thanh toán:</b> {invoice_booking.paymentDate}</Typography>
            <Typography><b>Tài khoản:</b> {invoice_booking.userId}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Đơn giá</TableCell>
                <TableCell>Điểm đến</TableCell>
                <TableCell>Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Người lớn</TableCell>
                <TableCell>{invoice_booking.numAdults}</TableCell>
                <TableCell>{formatCurrency(invoice_booking.priceAdult)}</TableCell>
                <TableCell>{invoice_booking.destination}</TableCell>
                <TableCell>{formatCurrency(invoice_booking.priceAdult * invoice_booking.numAdults)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Trẻ em</TableCell>
                <TableCell>{invoice_booking.numChildren}</TableCell>
                <TableCell>{formatCurrency(invoice_booking.priceChild)}</TableCell>
                <TableCell>{invoice_booking.destination}</TableCell>
                <TableCell>{formatCurrency(invoice_booking.priceChild * invoice_booking.numChildren)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Phương thức thanh toán:</Typography>
            {getPaymentMethodIcon(invoice_booking.paymentMethod)}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Vui lòng hoàn tất thanh toán theo hướng dẫn hoặc liên hệ với chúng tôi nếu cần hỗ trợ.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Số tiền phải trả trước {new Date(invoice_booking.startDate).toLocaleDateString('vi-VN')}
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Tổng tiền:</TableCell>
                  <TableCell align="right">{formatCurrency(invoice_booking.totalPrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Giảm giá</TableCell>
                  <TableCell align="right">0 vnđ</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Tổng tiền:</b></TableCell>
                  <TableCell align="right"><b>{formatCurrency(invoice_booking.amount)}</b></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
            In hóa đơn
          </Button>
          <Button variant="contained" color="primary" startIcon={<SendIcon />}>
            Gửi hóa đơn cho khách hàng
          </Button>
          {invoice_booking.bookingStatus === 'b' && (
            <Button variant="contained" color="success" startIcon={<CreditCardIcon />}>
              Xác nhận
            </Button>
          )}
          <Button variant="contained" color="info" startIcon={<PaidIcon />}>
            Đã thanh toán
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default BookingDetail;