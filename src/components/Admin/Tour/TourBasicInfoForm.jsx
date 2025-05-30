import React from 'react'
import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import { Editor } from "react-draft-wysiwyg"
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function TourBasicInfoForm({ formData, handleInputChange, editorState, onEditorStateChange, startDate, setStartDate, endDate, setEndDate, isEditMode, isLoading }) {
  // console.log("TourBasicInfoForm rendered with data:", { formData, isEditMode });
  return (
    <>
      {isEditMode && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Bạn đang chỉnh sửa tour hiện có. Các thông tin đã được điền sẵn.
        </Alert>
      )}
      <Grid container spacing={3} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="title"
            label="Nhập tên Tour"
            variant="outlined"
            size="small"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="destination"
            label="Điểm đến"
            variant="outlined"
            size="small"
            value={formData.destination}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="region-select-label">Chọn khu vực</InputLabel>
            <Select
              labelId="region-select-label"
              name="domain"
              label="Chọn khu vực"
              value={formData.domain}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="b">Miền Bắc</MenuItem>
              <MenuItem value="t">Miền Trung</MenuItem>
              <MenuItem value="n">Miền Nam</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            name="quantity"
            label="Số lượng"
            variant="outlined"
            size="small"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            name="priceAdult"
            label="Giá người lớn"
            variant="outlined"
            size="small"
            value={formData.priceAdult}
            onChange={handleInputChange}
            required
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            name="priceChild"
            label="Giá trẻ em"
            variant="outlined"
            size="small"
            value={formData.priceChild}
            onChange={handleInputChange}
            required
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="availability"
                checked={formData.availability}
                onChange={handleInputChange}
              />
            }
            label="Có thể đặt tour"
          />
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            label="Ngày khởi hành"
            value={startDate}
            onChange={setStartDate}
            format="DD/MM/YY"
            slotProps={{ textField: { fullWidth: true, size: "small" } }}
          />
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            label="Ngày kết thúc"
            value={endDate}
            onChange={setEndDate}
            format="DD/MM/YY"
            slotProps={{ textField: { fullWidth: true, size: "small" } }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#fafafa',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="body1" component="label" gutterBottom>
              Mô tả
            </Typography>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              editorStyle={{
                border: '1px solid rgb(129, 129, 129)',
                padding: '5px',
                minHeight: '200px'
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default TourBasicInfoForm