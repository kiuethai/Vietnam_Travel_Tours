import React from 'react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Button,
  Alert
} from '@mui/material';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import Dropzone from "react-dropzone"

function ImageUploader({ selectedFiles, handleAcceptedFiles, handleRemoveFile, isEditMode, isLoading }) {
  // console.log("ImageUploader rendered with files:", { selectedFiles, isEditMode });
  const hasExistingImages = selectedFiles.some(f => f.existingImage);
  const minRequiredImages = isEditMode ? (hasExistingImages ? 1 : 5) : 5;
  return (
    <>

      {isEditMode && hasExistingImages && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Tour đã có {selectedFiles.filter(f => f.existingImage).length} ảnh. Bạn có thể giữ nguyên hoặc thay đổi.
        </Alert>
      )}

      <Typography variant="body1" component="label" gutterBottom>
        Thêm ảnh (Tối thiểu {minRequiredImages} ảnh)
      </Typography>

      <Typography variant="caption" display="block" gutterBottom>
        Hình ảnh nên thể hiện rõ các điểm đến, hoạt động và cảnh quan của tour
      </Typography>

      <Dropzone
        onDrop={handleAcceptedFiles}
        accept={{
          'image/jpeg': [],
          'image/png': [],
          'image/jpg': []
        }}
        multiple={true}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className="dropzone"
            style={{
              border: '2px dashed #cccccc',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              marginBottom: '20px'
            }}
          >
            <div className="dz-message needsclick" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="mb-4">
                <Box sx={{ fontSize: '70px', color: '#9e9e9e', mb: 1 }}>
                  <i className="mdi mdi-cloud-upload"></i>
                </Box>
              </div>
              <Typography variant="h6">Kéo thả file hoặc click để tải lên</Typography>
              <Typography variant="caption">
                (Vui lòng chọn tối thiểu 5 hình ảnh chất lượng cao)
              </Typography>
            </div>
          </div>
        )}
      </Dropzone>

      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle1">
            Đã chọn {selectedFiles.length} hình ảnh:
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 3 }} id="file-previews">
        {selectedFiles.map((f, i) => (
          <Card
            sx={{
              mb: 1,
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              borderRadius: '4px'
            }}
            key={i + "-file"}
          >
            <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Box
                    component="img"
                    src={f.preview}
                    alt={f.name}
                    sx={{
                      height: 80,
                      width: 80,
                      objectFit: 'cover',
                      borderRadius: '4px',
                      bgcolor: '#f5f5f5'
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" color="textSecondary" fontWeight="500">
                    {f.name}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {f.formattedSize}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveFile(i)}
                  >
                    Xóa
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>


  )
}

export default ImageUploader