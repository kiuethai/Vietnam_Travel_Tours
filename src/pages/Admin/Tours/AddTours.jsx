import React, { useState, useEffect, useCallback } from "react"
import {
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import Dropzone from "react-dropzone"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addTourApi, addItineraryApi } from '~/apis'
import TourBasicInfoForm from "./TourBasicInfoForm";
import ImageUploader from "./ImageUploader";
import ItineraryEditor from "./ItineraryEditor";
import SuccessView from "./SuccessView";
// Main component

const AddTour = () => {
  // State management
  const [activeTab, setActiveTab] = useState("1");
  const [uiState, setUiState] = useState({
    loading: false,
    error: null,
    success: false
  });

  // Tour basic data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    domain: '',
    priceAdult: '',
    priceChild: '',
    destination: '',
    availability: true,
    itinerary: []
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Images
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Tour and itinerary data
  const [tour, setTour] = useState(null);
  const [createdTourId, setCreatedTourId] = useState(null);
  const [itineraries, setItineraries] = useState([]);

  // Form handling functions
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const onEditorStateChange = useCallback((newEditorState) => {
    setEditorState(newEditorState);
    const rawContentState = convertToRaw(newEditorState.getCurrentContent());
    setFormData(prev => ({
      ...prev,
      description: JSON.stringify(rawContentState)
    }));
  }, []);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleAcceptedFiles = useCallback((files) => {
    const newFiles = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      formattedSize: formatBytes(file.size),
    }));

    setSelectedFiles(prev => {
      const updatedFiles = [...prev, ...newFiles];
      setUiState(state => ({
        ...state,
        error: updatedFiles.length < 5 ? 'Vui lòng chọn tối thiểu 5 hình ảnh' : null
      }));
      return updatedFiles;
    });
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setSelectedFiles(prev => {
      const updatedFiles = [...prev];
      updatedFiles.splice(index, 1);
      setUiState(state => ({
        ...state,
        error: updatedFiles.length < 5 ? 'Vui lòng chọn tối thiểu 5 hình ảnh' : null
      }));
      return updatedFiles;
    });
  }, []);

  // Tour days calculation
  const calculateTourDays = useCallback((start, end) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  }, []);

  // Update itineraries when tour or dates change
  useEffect(() => {
    if (tour && startDate && endDate) {
      const daysRequired = calculateTourDays(startDate, endDate);
      const emptyItineraries = Array.from({ length: daysRequired }, (_, i) => ({
        tourId: tour.id,
        day: i + 1,
        title: `Ngày ${i + 1}`,
        description: EditorState.createEmpty()
      }));
      setItineraries(emptyItineraries);
    }
  }, [tour, startDate, endDate, calculateTourDays]);

  // Itinerary handling
  const handleItineraryChange = useCallback((index, field, value) => {
    setItineraries(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Navigation between tabs
  const handleNext = useCallback(() => {
    const nextTab = String(parseInt(activeTab) + 1);
    if (parseInt(activeTab) === 2) {
      handleSubmitTour();
    } else if (parseInt(nextTab) <= 4) {
      setActiveTab(nextTab);
    }
  }, [activeTab]);

  const handlePrevious = useCallback(() => {
    const prevTab = String(parseInt(activeTab) - 1);
    if (parseInt(prevTab) >= 1) {
      setActiveTab(prevTab);
    }
  }, [activeTab]);

  // API interactions
  const handleSubmitTour = useCallback(async () => {
    setUiState({ loading: true, error: null, success: false });

    try {
      // Validation
      if (selectedFiles.length < 5) {
        throw new Error('Vui lòng chọn tối thiểu 5 hình ảnh');
      }

      if (!formData.title || !formData.destination || !formData.domain ||
        !formData.quantity || !formData.priceAdult || !formData.priceChild ||
        !startDate || !endDate) {
        throw new Error('Vui lòng điền đầy đủ thông tin tour');
      }

      const tourData = new FormData();

      // Add form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'itinerary' && value !== null && value !== undefined) {
          tourData.append(key, value);
        }
      });

      // Add dates
      if (startDate) tourData.append('startDate', dayjs(startDate).format('YYYY-MM-DD')); // Changed date format
      if (endDate) tourData.append('endDate', dayjs(endDate).format('YYYY-MM-DD')); // Changed date format

      // Add images
      selectedFiles.forEach(file => {
        tourData.append('images', file);
      });

      const response = await addTourApi(tourData);

      if (!response) throw new Error("Không nhận được phản hồi từ máy chủ");

      // Simplified response handling
      const responseData = response.data || response;
      const tourId = responseData.id || responseData.tourId;

      if (!tourId) {
        throw new Error("Không tìm thấy ID tour trong phản hồi từ máy chủ");
      }

      setCreatedTourId(tourId);
      setTour(responseData);
      setActiveTab("3");
    } catch (err) {
      console.error('Error details:', err);
      setUiState(state => ({
        ...state,
        error: err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi thêm tour',
        loading: false
      }));
      return;
    }

    setUiState(state => ({ ...state, loading: false }));
  }, [formData, selectedFiles, startDate, endDate]);
  const handleSubmitItineraries = useCallback(async () => {
    setUiState({ loading: true, error: null, success: false });

    try {
      if (!createdTourId) {
        throw new Error("Tour ID không tồn tại!");
      }

      if (!itineraries || itineraries.length === 0) {
        throw new Error("Không có dữ liệu lộ trình để gửi");
      }

      // Format itineraries for API
      const formattedItineraries = itineraries.map(itinerary => ({
        day: itinerary.day,
        title: itinerary.title,
        description: itinerary.description instanceof EditorState
          ? JSON.stringify(convertToRaw(itinerary.description.getCurrentContent()))
          : itinerary.description
      }));

      await addItineraryApi(createdTourId, { itineraries: formattedItineraries });

      setUiState({ loading: false, error: null, success: true });
      setActiveTab("4");
    } catch (err) {
      console.error("Error details:", err);
      setUiState({
        loading: false,
        error: err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi thêm lộ trình',
        success: false
      });
    }
  }, [createdTourId, itineraries]);

  // Form submission handler
  const handleSubmit = () => handleSubmitItineraries();

  // Check if form can proceed to next step
  const canProceedToNext = () => {
    if (activeTab === "1") {
      return !(!formData.title || !formData.destination || !formData.domain ||
        !formData.quantity || !formData.priceAdult || !formData.priceChild ||
        !startDate || !endDate);
    }
    if (activeTab === "2") {
      return selectedFiles.length >= 5;
    }
    return true;
  };

  const { loading, error, success } = uiState;

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="page-content">
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="h4" gutterBottom>
                      Thêm Tour Du Lịch
                    </Typography>

                    {error && (
                      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>
                    )}

                    <Box sx={{ width: '100%', marginTop: 3 }}>
                      <Stepper activeStep={parseInt(activeTab) - 1} alternativeLabel>
                        <Step><StepLabel>Bước 1: Nhập thông tin</StepLabel></Step>
                        <Step><StepLabel>Bước 2: Thêm hình ảnh</StepLabel></Step>
                        <Step><StepLabel>Bước 3: Lộ trình</StepLabel></Step>
                        <Step><StepLabel>Xác nhận kết quả</StepLabel></Step>
                      </Stepper>

                      <TabContext value={activeTab}>
                        <Box sx={{ mt: 3, mb: 3 }}>
                          <TabPanel value="1">
                            <TourBasicInfoForm
                              formData={formData}
                              handleInputChange={handleInputChange}
                              editorState={editorState}
                              onEditorStateChange={onEditorStateChange}
                              startDate={startDate}
                              setStartDate={setStartDate}
                              endDate={endDate}
                              setEndDate={setEndDate}
                            />
                          </TabPanel>

                          <TabPanel value="2">
                            <ImageUploader
                              selectedFiles={selectedFiles}
                              handleAcceptedFiles={handleAcceptedFiles}
                              handleRemoveFile={handleRemoveFile}
                            />
                          </TabPanel>

                          <TabPanel value="3">
                            <ItineraryEditor
                              tour={tour}
                              itineraries={itineraries}
                              handleItineraryChange={handleItineraryChange}
                            />
                          </TabPanel>
                          <TabPanel value="4">
                            <Grid container justifyContent="center">
                              <Grid item xs={12} md={6}>
                                <SuccessView
                                  loading={loading}
                                  success={success}
                                  handleSubmit={handleSubmit}
                                />
                              </Grid>
                            </Grid>
                          </TabPanel>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={activeTab === "1" || loading}
                            onClick={handlePrevious}
                          >
                            Lùi
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={activeTab === "4" || loading || !canProceedToNext()}
                            onClick={handleNext}
                          >
                            Tiếp
                          </Button>
                        </Box>
                      </TabContext>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </div>
      </LocalizationProvider>
    </React.Fragment>
  );
};

export default AddTour;