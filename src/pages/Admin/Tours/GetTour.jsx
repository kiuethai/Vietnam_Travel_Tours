/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllToursAPI, updateTourApi } from '~/apis'
import {
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material'
import moment from 'moment'
import Widget from '~/components/Admin/Widget/Widget'
import { Button } from '~/components/Admin/Wrappers/Wrappers'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination/TablePagination'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Notification from '~/components/Admin/Notification/Notification'
import { toast } from 'react-toastify'
import { Typography, Chip } from '~/components/Admin/Wrappers/Wrappers'
import {
  useManagementDispatch,
  useManagementState,
} from '~/context/ManagementContext'

import useStyles from './styles'

import { actions } from '~/context/ManagementContext'
import { getComparator, stableSort } from '~/utils/arrange'
import EnhancedTableHead from '~/components/Admin/Tour/EnhancedTableHead'

// Initialize default column widths - these values can be adjusted
const defaultColumnWidths = {
  index: 60,
  title: 200,
  time: 100,
  priceAdult: 120,
  priceChild: 120,
  quantity: 70,
  destination: 150,
  availability: 100,
  dates: 150,
  ACTIONS: 120,
};


const headCells = [
  { id: 'index', numeric: false, disablePadding: false, label: 'STT' },
  { id: 'title', numeric: false, disablePadding: false, label: 'Tên Tour' },
  { id: 'time', numeric: false, disablePadding: false, label: 'Thời gian' },
  { id: 'priceAdult', numeric: false, disablePadding: false, label: 'Giá người lớn' },
  { id: 'priceChild', numeric: false, disablePadding: false, label: 'Giá trẻ em' },
  { id: 'quantity', numeric: false, disablePadding: false, label: 'SL' },
  { id: 'destination', numeric: false, disablePadding: false, label: 'Điểm đến' },
  { id: 'availability', numeric: false, disablePadding: false, label: 'Trạng thái' },
  { id: 'dates', numeric: false, disablePadding: false, label: 'Ngày' },
  { id: 'ACTIONS', numeric: false, disablePadding: false, label: 'Thao tác' },
];

function GetTour() {
  const navigate = useNavigate()
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('title')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tourRows, setTourRows] = useState([])
  const [loading, setLoading] = useState(false)
  // New state for column widths
  const [columnWidths, setColumnWidths] = useState({ ...defaultColumnWidths })

  const managementDispatch = useManagementDispatch()
  const managementValue = useManagementState()
  const classes = useStyles()


  const openModal = useCallback(id => actions.doOpenConfirm(id)(managementDispatch), [managementDispatch])

  const openProductEdit = (event, id) => {
    event.stopPropagation()
    navigate(`/admin/tours/getAllTour/edit/${id}`);
  }

  const closeModal = useCallback(() => actions.doCloseConfirm()(managementDispatch), [managementDispatch]);

  const sortedAndPaginatedRows = useMemo(() =>
    stableSort(tourRows, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [tourRows, order, orderBy, page, rowsPerPage]
  );

  const emptyRowsInCurrentPage = useMemo(() =>
    rowsPerPage - Math.min(rowsPerPage, tourRows.length - page * rowsPerPage),
    [rowsPerPage, tourRows.length, page]
  );

  const handleDelete = async () => {
    try {
      setLoading(true);
      const tourId = managementValue.idToDelete;

      if (!tourId) {
        sendNotification('ID tour không hợp lệ');
        closeModal();
        return;
      }
      await updateTourApi(tourId, { _destroy: true });
      await fetchTours();
      closeModal();
      sendNotification('Tour đã được xóa thành công');
    } catch (error) {
      sendNotification('Không thể xóa tour');
    } finally {
      setLoading(false);
    }
  };

  const toggleTourAvailability = async (tourId, currentStatus) => {
    try {
      setLoading(true);
      if (!tourId) {
        sendNotification('ID tour không hợp lệ');
        return;
      }
      await updateTourApi(tourId, { availability: !currentStatus });
      await fetchTours();
      sendNotification(`Tour đã được ${!currentStatus ? 'kích hoạt' : 'tạm ngừng'} thành công`);
    } catch (error) {
      sendNotification('Không thể cập nhật trạng thái tour');
    } finally {
      setLoading(false);
    }
  };

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await getAllToursAPI();
      const tours = Array.isArray(res) ? res : [];
      setTourRows(tours);
      // Tự động cập nhật trạng thái nếu đã hết hạn mà vẫn đang hoạt động
      tours.forEach(async (tour) => {
        if (
          tour.endDate &&
          moment().isAfter(moment(tour.endDate), 'day') &&
          tour.availability
        ) {
          await updateTourApi(tour._id, { availability: false });
        }
      });
    } catch (error) {
      sendNotification('Không thể tải dữ liệu tour');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  function sendNotification(text) {
    const componentProps = {
      type: "feedback",
      message: text,
      variant: "contained",
      color: "success"
    };
    const options = {
      type: "info",
      position: toast.success,
      progressClassName: classes.progress,
      className: classes.notification,
      timeOut: 1000
    };
    return toast(
      <Notification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      options
    );
  }

  const handleRequestSort = useCallback((event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleClick = useCallback((event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1)
      ];
    }
    setSelected(newSelected);
  }, [selected]);

  const handleChangePage = useCallback((_, newPage) => setPage(newPage), []);

  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const isSelected = useCallback(id => selected.indexOf(id) !== -1, [selected]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleColumnResize = useCallback((columnId, width) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: width
    }));
  }, []);

  return (
    <Grid container spacing={3}>
      <Dialog
        open={managementValue.modalOpen}
        onClose={closeModal}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Bạn có chắc chắn muốn xóa tour này không?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tour sẽ bị xóa khỏi hệ thống.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeModal}
            color="primary"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            autoFocus
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        {/* Tiêu đề trang */}
        <Box p={5}>
          <Typography variant="h5" weight="bold">
            Quản lý danh sách tour
          </Typography>
        </Box>
        <Widget inheritHeight noBodyPadding>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto' }}>
              <Table
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
                stickyHeader
                style={{ tableLayout: 'fixed' }}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={tourRows.length}
                  columnWidths={columnWidths}
                  onColumnResize={handleColumnResize}
                  headCells={headCells}
                />
                <TableBody>
                  {sortedAndPaginatedRows.map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, row._id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id || index}
                        selected={isItemSelected}
                        style={{ height: '60px' }}
                      >
                        <TableCell padding="none" align="center" style={{ width: columnWidths['index'] }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="left" style={{ width: columnWidths['title'], whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          <Typography variant="body2" title={row.title}>
                            {row.title}
                          </Typography>
                        </TableCell>
                        <TableCell align="left" style={{ width: columnWidths['time'] }}>
                          <Typography variant="body2">
                            {row.time || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{ width: columnWidths['priceAdult'] }}>
                          <Typography variant="body2">
                            {formatPrice(row.priceAdult)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" style={{ width: columnWidths['priceChild'] }}>
                          <Typography variant="body2">
                            {formatPrice(row.priceChild)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" style={{ width: columnWidths['quantity'] }}>
                          <Typography variant="body2">
                            {row.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="left" style={{ width: columnWidths['destination'], whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          <Typography variant="body2" title={row.destination}>
                            {row.destination}
                          </Typography>
                        </TableCell>

                        <TableCell align="center" style={{ width: columnWidths['availability'] }}>
                          <Chip
                            label={
                              row.endDate && moment().isAfter(moment(row.endDate), 'day')
                                ? 'Tạm ngừng'
                                : (row.availability ? 'Hoạt động' : 'Tạm ngừng')
                            }
                            style={{
                              color: '#fff',
                              backgroundColor:
                                row.endDate && moment().isAfter(moment(row.endDate), 'day')
                                  ? '#FF5C93'
                                  : (row.availability ? '#3CD4A0' : '#FF5C93'),
                              fontSize: 11,
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>

                        <TableCell align="left" style={{ width: columnWidths['dates'] }}>
                          <Typography variant="body2" >
                            {row.startDate && moment(row.startDate).format('DD/MM/YYYY')}
                            {row.endDate && ` - ${moment(row.endDate).format('DD/MM/YYYY')}`}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" style={{ width: columnWidths['ACTIONS'] }}>
                          <Box display="flex" justifyContent="center">
                            {/* handle edit */}
                            <IconButton
                              onClick={e => openProductEdit(e, row._id)}
                              color="primary"
                              size="small"
                              title="Sửa"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>


                            {/* handle toggle availability */}
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTourAvailability(row._id, row.availability);
                              }}
                              color={row.availability ? "secondary" : "success"}
                              size="small"
                              title={row.availability ? "Tạm ngừng" : "Kích hoạt"}
                            >
                              {row.availability ? (
                                <span style={{ fontSize: '20px' }}>🔴</span>
                              ) : (
                                <span style={{ fontSize: '20px' }}>🟢</span>
                              )}
                            </IconButton>
                            {/* handle delete */}
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(row._id);
                              }}
                              color="error"
                              size="small"
                              title="Xóa"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {emptyRowsInCurrentPage > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRowsInCurrentPage }}>
                      <TableCell colSpan={10} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={tourRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Widget>
      </Grid>
    </Grid>
  );
}

export default GetTour;