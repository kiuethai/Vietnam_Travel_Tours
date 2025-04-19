import React from 'react'
import {
  TextField,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Editor } from "react-draft-wysiwyg"
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
function ItineraryEditor({ tour, itineraries, handleItineraryChange, isEditMode, isLoading }) {
  console.log("ItineraryEditor rendered with:", tour);
  console.log("ItineraryEditor itineraries with:", itineraries);

  return (
    <>
      <Typography variant="body1" component="label">
        {isEditMode ? "Cập nhật lộ trình chi tiết" : "Nhập lộ trình chi tiết"}
      </Typography>
      {tour ? (
        <Alert severity={isEditMode ? "info" : "success"} sx={{ mt: 2, mb: 2 }}>
          {isEditMode
            ? `Đang chỉnh sửa lộ trình cho tour "${tour.title}". Lộ trình gồm ${itineraries.length} ngày.`
            : `Tour "${tour.title}" đã được tạo thành công. Vui lòng nhập lộ trình cho ${itineraries.length} ngày.`}
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          Đang tải thông tin tour...
        </Alert>
      )}

      {itineraries && itineraries.map((item, index) => (
        <Box
          key={index}
          sx={{
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#fafafa',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <TextField
            fullWidth
            type="text"
            label={`Ngày ${item.day}`}
            variant="outlined"
            size="small"
            value={item.title}
            onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
            sx={{ mb: 2 }}
          />
          <Editor
            editorState={item.description instanceof EditorState
              ?
              item.description :
              EditorState.createEmpty()}
            onEditorStateChange={(editorState) => handleItineraryChange(index, 'description', editorState)}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorStyle={{
              border: '1px solid rgb(129, 129, 129)',
              padding: '10px',
              minHeight: '200px'
            }}
          />
        </Box>
      ))}


    </>
  )
}

export default ItineraryEditor