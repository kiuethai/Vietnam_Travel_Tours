import React, { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { updateTourApi, getTourByIdAPI } from '~/apis'
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addTourApi } from '~/apis'
// Main component
import TourBasicInfoForm from "~/components/Admin/Tour/TourBasicInfoForm";
import ImageUploader from "~/components/Admin/Tour/ImageUploader";
import ItineraryEditor from "~/components/Admin/Tour/ItineraryEditor";
import SuccessView from "~/components/Admin/Tour/SuccessView";
import { formatBytes } from "~/utils/validators";

const UpdateTour = () => {
  // State management
  const [activeTab, setActiveTab] = useState("1");
  const [uiState, setUiState] = useState({
    loading: false,
    error: null,
    success: false
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

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

  // Add state to track original data for change detection
  const [originalTourData, setOriginalTourData] = useState(null);
  const [originalItineraries, setOriginalItineraries] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

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

  // Check if any changes were made to the tour data
  const checkForChanges = useCallback(() => {
    if (!originalTourData) return true; // If no original data, assume changes

    // Check basic form data changes
    const formChanged =
      originalTourData.title !== formData.title ||
      originalTourData.quantity !== formData.quantity ||
      originalTourData.domain !== formData.domain ||
      originalTourData.priceAdult !== formData.priceAdult ||
      originalTourData.priceChild !== formData.priceChild ||
      originalTourData.destination !== formData.destination ||
      originalTourData.availability !== formData.availability;

    // Check date changes
    const originalStartDate = originalTourData.startDate ? dayjs(originalTourData.startDate) : null;
    const originalEndDate = originalTourData.endDate ? dayjs(originalTourData.endDate) : null;
    const datesChanged =
      (!originalStartDate && startDate) ||
      (!startDate && originalStartDate) ||
      (!originalEndDate && endDate) ||
      (!endDate && originalEndDate) ||
      (originalStartDate && startDate && !originalStartDate.isSame(startDate, 'day')) ||
      (originalEndDate && endDate && !originalEndDate.isSame(endDate, 'day'));

    // Check image changes
    const imagesChanged =
      originalImages.length !== selectedFiles.length ||
      selectedFiles.some(file => !file.existingImage);

    // Check itinerary changes (simplified check)
    const itinerariesChanged = itineraries.length !== originalItineraries.length;

    const hasAnyChanges = formChanged || datesChanged || imagesChanged || itinerariesChanged;
    setHasChanges(hasAnyChanges);
    return hasAnyChanges;
  }, [formData, startDate, endDate, selectedFiles, itineraries, originalTourData, originalImages, originalItineraries]);

  useEffect(() => {
    const fetchTourData = async () => {
      if (!id) return;

      setUiState(prev => ({ ...prev, loading: true }));
      try {
        // Fetch tour details
        const tourData = await getTourByIdAPI(id);
        if (!tourData) throw new Error("Không tìm thấy dữ liệu tour");

        // Save original data for comparison later
        setOriginalTourData({ ...tourData });

        // Set form data
        setFormData({
          title: tourData.title || '',
          description: tourData.description || '',
          quantity: tourData.quantity?.toString() || '',
          domain: tourData.domain || '',
          priceAdult: tourData.priceAdult?.toString() || '',
          priceChild: tourData.priceChild?.toString() || '',
          destination: tourData.destination || '',
          availability: tourData.availability !== undefined ? tourData.availability : true,
          itinerary: []
        });

        // Set dates
        if (tourData.startDate) setStartDate(dayjs(tourData.startDate));
        if (tourData.endDate) setEndDate(dayjs(tourData.endDate));

        // Set editor state from description
        if (tourData.description) {
          try {
            const contentState = convertFromRaw(JSON.parse(tourData.description));
            setEditorState(EditorState.createWithContent(contentState));
          } catch (e) {
            console.error("Error parsing description:", e);
            setEditorState(EditorState.createWithContent(
              ContentState.createFromText(tourData.description || '')
            ));
          }
        }

        // Set tour and createdTourId for next steps
        setTour(tourData);
        setCreatedTourId(id);

        // Get itineraries from tour data directly
        if (tourData.itineraries && tourData.itineraries.length > 0) {
          // Save original itineraries
          setOriginalItineraries([...tourData.itineraries]);

          const formattedItineraries = tourData.itineraries.map(item => ({
            ...item,
            description: item.description ? (() => {
              try {
                const parsedContent = JSON.parse(item.description);
                return EditorState.createWithContent(convertFromRaw(parsedContent));
              } catch (e) {
                return EditorState.createWithContent(
                  ContentState.createFromText(item.description || '')
                );
              }
            })() : EditorState.createEmpty()
          }));

          setItineraries(formattedItineraries);
        } else {
          // If no itineraries, create empty ones based on tour duration
          const daysRequired = calculateTourDays(
            tourData.startDate && dayjs(tourData.startDate),
            tourData.endDate && dayjs(tourData.endDate)
          );

          const emptyItineraries = Array.from({ length: daysRequired }, (_, i) => ({
            tourId: id,
            day: i + 1,
            title: `Ngày ${i + 1}`,
            description: EditorState.createEmpty()
          }));

          setItineraries(emptyItineraries);
        }

        // If images exist, fetch and set them
        if (tourData.images && tourData.images.length > 0) {
          const imageFiles = tourData.images.map((img, index) => ({
            preview: img.url || img,
            formattedSize: 'Existing image',
            name: `existing-image-${index}`,
            existingImage: true,
            path: img.path || img
          }));
          setSelectedFiles(imageFiles);
          setOriginalImages([...imageFiles]);
        }

      } catch (err) {
        console.error('Error fetching tour data:', err);
        setUiState(prev => ({
          ...prev,
          error: err.message || 'Không thể tải dữ liệu tour',
        }));
      } finally {
        setUiState(prev => ({ ...prev, loading: false }));
      }
    };

    fetchTourData();
  }, [id, calculateTourDays]);

  const handleSubmitTour = useCallback(async () => {
    setUiState({ loading: true, error: null, success: false });

    try {
      // Run validations
      if (!formData.title || !formData.destination || !formData.domain ||
        !formData.quantity || !formData.priceAdult || !formData.priceChild ||
        !startDate || !endDate) {
        throw new Error('Vui lòng điền đầy đủ thông tin tour');
      }

      const minRequiredImages = isEditMode ?
        (selectedFiles.some(f => f.existingImage) ? 1 : 5) : 5;

      if (selectedFiles.length < minRequiredImages) {
        throw new Error(`Vui lòng chọn tối thiểu ${minRequiredImages} hình ảnh`);
      }

      // In edit mode, just prepare data for the itinerary step
      if (isEditMode) {
        // If tour already has itineraries, they should already be loaded
        // Otherwise, create default itineraries based on tour duration
        if (itineraries.length === 0) {
          const daysRequired = calculateTourDays(startDate, endDate);
          const emptyItineraries = Array.from({ length: daysRequired }, (_, i) => ({
            tourId: id,
            day: i + 1,
            title: `Ngày ${i + 1}`,
            description: EditorState.createEmpty()
          }));
          setItineraries(emptyItineraries);
        }

        // Ensure tour data is set for the next steps
        if (!tour) {
          setTour({
            id,
            ...formData,
            startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
            endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
            images: selectedFiles
          });
        }

        setCreatedTourId(id);
        setActiveTab("3");
      } else {
        // For new tour, make API call as before
        const tourData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'itinerary' && value !== null && value !== undefined) {
            tourData.append(key, value);
          }
        });

        if (startDate) tourData.append('startDate', dayjs(startDate).format('YYYY-MM-DD'));
        if (endDate) tourData.append('endDate', dayjs(endDate).format('YYYY-MM-DD'));

        selectedFiles.forEach(file => {
          tourData.append('images', file);
        });

        const response = await addTourApi(tourData);
        if (!response) throw new Error("Không nhận được phản hồi từ máy chủ");

        const responseData = response.data || response;
        const tourId = responseData.id || responseData.tourId;

        if (!tourId) {
          throw new Error("Không tìm thấy ID tour trong phản hồi từ máy chủ");
        }

        setCreatedTourId(tourId);
        setTour(responseData);
        setActiveTab("3");
      }
    } catch (err) {
      console.error('Error details:', err);
      setUiState(state => ({
        ...state,
        error: err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi cập nhật tour',
        loading: false
      }));
      return;
    }

    setUiState(state => ({ ...state, loading: false }));
  }, [formData, selectedFiles, startDate, endDate, id, isEditMode, tour, itineraries.length, calculateTourDays]);

  const handleSubmit = useCallback(async () => {
    // Check for changes before submitting
    const shouldUpdate = checkForChanges();

    if (!shouldUpdate && isEditMode) {
      // No changes were made, just show success without API call
      setUiState({ loading: false, error: null, success: true });
      return;
    }

    setUiState({ loading: true, error: null, success: false });

    try {
      if (!createdTourId) {
        throw new Error("Tour ID không tồn tại!");
      }

      if (isEditMode && shouldUpdate) {
        const tourData = new FormData();

        // Add basic tour information
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'itinerary' && value !== null && value !== undefined) {
            tourData.append(key, value);
          }
        });

        // Add dates
        if (startDate) tourData.append('startDate', dayjs(startDate).format('YYYY-MM-DD'));
        if (endDate) tourData.append('endDate', dayjs(endDate).format('YYYY-MM-DD'));

        // Add new images (filter out existing images)
        const newImages = selectedFiles.filter(file => !file.existingImage);
        newImages.forEach(file => {
          tourData.append('images', file);
        });

        // Add list of existing images to keep
        const existingImages = selectedFiles
          .filter(file => file.existingImage)
          .map(file => file.path);

        if (existingImages.length > 0) {
          tourData.append('existingImages', JSON.stringify(existingImages));
        }

        // Format itineraries for API
        const formattedItineraries = itineraries.map(itinerary => ({
          id: itinerary.id,
          day: itinerary.day,
          title: itinerary.title,
          description: itinerary.description instanceof EditorState
            ? JSON.stringify(convertToRaw(itinerary.description.getCurrentContent()))
            : itinerary.description
        }));

        // Add itineraries to form data
        tourData.append('itineraries', JSON.stringify(formattedItineraries));

        // Make a single API call to update the tour with all data
        await updateTourApi(id, tourData);
      } else if (!isEditMode) {
        // Same logic for creating new tour and itineraries
        const tourData = new FormData();

        // Add form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'itinerary' && value !== null && value !== undefined) {
            tourData.append(key, value);
          }
        });

        // Add dates
        if (startDate) tourData.append('startDate', dayjs(startDate).format('YYYY-MM-DD'));
        if (endDate) tourData.append('endDate', dayjs(endDate).format('YYYY-MM-DD'));

        // Add images
        selectedFiles.forEach(file => {
          tourData.append('images', file);
        });

        // Format itineraries for API
        const formattedItineraries = itineraries.map(itinerary => ({
          day: itinerary.day,
          title: itinerary.title,
          description: itinerary.description instanceof EditorState
            ? JSON.stringify(convertToRaw(itinerary.description.getCurrentContent()))
            : itinerary.description
        }));

        // Add itineraries to form data
        tourData.append('itineraries', JSON.stringify(formattedItineraries));

        await addTourApi(tourData);
      }

      setUiState({ loading: false, error: null, success: true });
    } catch (err) {
      console.error("Error details:", err);
      setUiState({
        loading: false,
        error: err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi cập nhật lộ trình',
        success: false
      });
    }
  }, [createdTourId, itineraries, isEditMode, formData, startDate, endDate, selectedFiles, id, checkForChanges]);

  const { loading, error, success } = uiState;

  const SuccessViewWithChanges = ({ loading, success, handleSubmit }) => (
    <div className="text-center p-5">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : success ? (
        <>
          <i className="bx bx-check-circle text-success display-3"></i>
          <h4 className="mt-3">Cập nhật tour thành công!</h4>
          <p>Tour đã được lưu vào hệ thống.</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/tours/getAllTour')}
            className="mt-3"
          >
            Về trang quản lý tour
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Xác nhận cập nhật tour
          </Typography>
          {hasChanges ? (
            <Typography variant="body1" gutterBottom>
              Bạn đã thay đổi thông tin tour. Nhấn Xác nhận để lưu các thay đổi.
            </Typography>
          ) : (
            <Typography variant="body1" gutterBottom>
              Không có thay đổi nào được thực hiện. Bạn có thể quay lại danh sách tour.
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="mt-3"
            disabled={!hasChanges}
          >
            {hasChanges ? 'Xác nhận' : 'Không có thay đổi'}
          </Button>
        </>
      )}
    </div>
  );

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
                      {isEditMode ? "Chỉnh sửa Tour Du Lịch" : "Tạo Tour Du Lịch Mới"}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/admin/tours/getAllTour')}
                      >
                        Quay lại danh sách tour
                      </Button>
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
                              isLoading={loading}
                            />
                          </TabPanel>

                          <TabPanel value="2">
                            <ImageUploader
                              selectedFiles={selectedFiles}
                              handleAcceptedFiles={handleAcceptedFiles}
                              handleRemoveFile={handleRemoveFile}
                              isLoading={loading}
                            />
                          </TabPanel>

                          <TabPanel value="3">
                            <ItineraryEditor
                              tour={tour}
                              itineraries={itineraries}
                              handleItineraryChange={handleItineraryChange}
                              isLoading={loading}
                            />
                          </TabPanel>

                          <TabPanel value="4">
                            <Grid container justifyContent="center">
                              <Grid item xs={12} md={8}>
                                {checkForChanges()} {/* Trigger change check when tab is active */}
                                <SuccessView
                                  loading={loading}
                                  success={success}
                                  handleSubmit={handleSubmit}
                                  isEditMode={isEditMode}
                                  hasChanges={hasChanges}
                                  tourSummary={{
                                    title: formData.title,
                                    destination: formData.destination,
                                    domain: formData.domain,
                                    priceAdult: formData.priceAdult,
                                    priceChild: formData.priceChild,
                                    startDate: startDate ? startDate.format('DD/MM/YYYY') : '',
                                    endDate: endDate ? endDate.format('DD/MM/YYYY') : '',
                                    days: itineraries.length,
                                    availability: formData.availability
                                  }}
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
                            {activeTab === "3" ? "Hoàn tất" : "Tiếp"}
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

export default UpdateTour