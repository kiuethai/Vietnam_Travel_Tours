import React from 'react'
import {
  Typography,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link } from "react-router-dom";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

function SuccessView({loading, success, handleSubmit}) {
  return (
    <>
      <Box textAlign="center">
        {loading ? (
          <Box mb={2}>
            <CircularProgress />
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Đang xử lý...
            </Typography>
          </Box>
        ) : success ? (
          <Box mb={2}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Thêm Tour Thành Công!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Tour du lịch mới đã được thêm vào hệ thống
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              component={Link}
              to="/admin/tours"
            >
              Quay lại danh sách tour
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" gutterBottom>
              Xác nhận thông tin
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Vui lòng kiểm tra lại thông tin tour trước khi hoàn tất
            </Typography>

            <Box sx={{ mt: 4, mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Hoàn tất
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    

    </>
  )
}

export default SuccessView