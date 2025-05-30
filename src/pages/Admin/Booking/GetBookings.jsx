/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBookingsAPI, updateBookingApi } from '~/apis'
import {
  Grid,
  Box,
  CircularProgress,
} from '@mui/material'
import moment from 'moment'
import Widget from '~/components/Admin/Widget/Widget'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination/TablePagination'
import TableRow from '@mui/material/TableRow'

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { toast } from 'react-toastify'
import {Typography, Chip } from '~/components/Admin/Wrappers/Wrappers'
import useStyles from '~/pages/Admin/Tours/styles'
import { getComparator, stableSort } from '~/utils/arrange'
import iconMomo from '~/assets/images/icons/icon_momo.png'
import iconPaypal from '~/assets/images/icons/icon_paypal.png'
import iconOffice from '~/assets/images/icons/icon_office.png'
import EnhancedTableHead from '~/components/Admin/Tour/EnhancedTableHead'
// Initialize default column widths - these values can be adjusted
const defaultColumnWidths = {
  index: 60,
  tourTitle: 200,
  fullName: 160,
  email: 200,
  phoneNumber: 120,
  address: 220,
  createdAt: 110,
  numAdults: 90,
  numChildren: 90,
  totalPrice: 130,
  status: 120,
  paymentStatus: 120,
  paymentMethod: 140,
  ACTIONS: 140,
};


const headCells = [
  { id: 'index', label: 'STT' },
  { id: 'tourTitle', label: 'Tên Tour' },
  { id: 'fullName', label: 'Tên khách hàng' },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Số điện thoại' },
  { id: 'address', label: 'Địa chỉ' },
  { id: 'createdAt', label: 'Ngày đặt' },
  { id: 'numAdults', label: 'Người lớn' },
  { id: 'numChildren', label: 'Trẻ em' },
  { id: 'totalPrice', label: 'Tổng giá tiền' },
  { id: 'status', label: 'Trạng thái Booking' },
  { id: 'paymentStatus', label: 'Thanh Toán' },
  { id: 'paymentMethod', label: 'Phương thức thanh toán' },
  { id: 'ACTIONS', label: 'Hành Động' },
];

function GetBookings() {
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
  const classes = useStyles()


  const sortedAndPaginatedRows = useMemo(() =>
    stableSort(tourRows, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [tourRows, order, orderBy, page, rowsPerPage]
  );

  const emptyRowsInCurrentPage = useMemo(() =>
    rowsPerPage - Math.min(rowsPerPage, tourRows.length - page * rowsPerPage),
    [rowsPerPage, tourRows.length, page]
  );

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookingsAPI();
      // console.log('🚀 ~ fetchBookings ~ res:', res.tours)
      setTourRows(Array.isArray(res.tours) ? res.tours : []);
    } catch (error) {
      toast.error('Không thể tải dữ liệu booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
      <Grid item xs={12}>
        {/* Tiêu đề trang */}
        <Box p={5}>
          <Typography variant="h5" weight="bold">
            Quản lý danh sách đặt tour
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
                        <TableCell align="center" style={{ width: columnWidths['index'] }}>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell align="left" style={{ width: columnWidths['tourTitle'] }}>

                          {row.tourTitle}

                        </TableCell>
                        <TableCell align="left" style={{ width: columnWidths['fullName'] }}>
                          {row.fullName}
                        </TableCell>
                        <TableCell align="left" style={{ width: columnWidths['email'] }}>{row.email}</TableCell>
                        <TableCell align="left" style={{ width: columnWidths['phoneNumber'] }}>{row.phoneNumber}</TableCell>
                        <TableCell align="left" style={{ width: columnWidths['address'] }}>{row.address}</TableCell>
                        <TableCell align="left" style={{ width: columnWidths['createdAt'] }}>{row.createdAt ? moment(row.createdAt).format('DD/MM/YYYY') : ''}</TableCell>
                        <TableCell align="center" style={{ width: columnWidths['numAdults'] }}>{row.numAdults}</TableCell>
                        <TableCell align="center" style={{ width: columnWidths['numChildren'] }}>{row.numChildren}</TableCell>
                        <TableCell align="right" style={{ width: columnWidths['totalPrice'] }}> {formatPrice(row.totalPrice)}</TableCell>
                        <TableCell align="center" style={{ width: columnWidths['status'] }}>
                          <Chip
                            label={row.status === 'pending' ? 'Chờ xử lý' : row.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                            style={{
                              color: '#fff',
                              backgroundColor: row.status === 'pending' ? '#FF9800' : row.status === 'confirmed' ? '#3CD4A0' : '#FF5C93',
                              fontSize: 11,
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" style={{ width: columnWidths['paymentStatus'] }}>
                          <Chip
                            label={row.paymentStatus === 'y' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            style={{
                              color: '#fff',
                              backgroundColor: row.paymentStatus === 'y' ? '#3CD4A0' : '#FF5C93',
                              fontSize: 11,
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            width: columnWidths['paymentMethod'] || defaultColumnWidths['paymentMethod'],
                            minWidth: 60,
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            paddingLeft: 8,
                            paddingRight: 8,
                          }}
                        >
                          {row.paymentMethod === 'momo-payment' && (
                            <img src={iconMomo} alt="Momo" style={{ width: 32, height: 32 }} />
                          )}
                          {row.paymentMethod === 'paypal-payment' && (
                            <img src={iconPaypal} alt="Paypal" style={{ width: 32, height: 32 }} />
                          )}
                          {row.paymentMethod === 'office-payment' && (
                            <img src={iconOffice} alt="Office" style={{ width: 32, height: 32 }} />
                          )}

                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" gap={1}>
                            <Select
                              id="ACTIONS"
                              autoWidth
                            >
                              {/* Xác nhận */}
                              {row.status !== 'confirmed' && (
                                <MenuItem
                                  size="small"
                                  color="success"
                                  variant="contained"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    setLoading(true);
                                    try {
                                      await updateBookingApi(row._id, { status: 'confirmed' });
                                      toast.success('Đã xác nhận booking');
                                      await fetchBookings();
                                      window.location.reload();
                                    } catch {
                                      toast.error('Lỗi xác nhận booking');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >
                                  Xác nhận
                                </MenuItem>
                              )}
                              {/* Xem chi tiết */}
                              <MenuItem
                                size="small"
                                color="primary"
                                variant="outlined"
                                onClick={e => {
                                  e.stopPropagation();
                                  navigate(`/admin/booking-detail/${row._id}`);
                                }}
                              >
                                Xem chi tiết
                              </MenuItem>
                            </Select>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRowsInCurrentPage > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRowsInCurrentPage }}>
                      <TableCell colSpan={13} />
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
    </Grid >
  );
}

export default GetBookings
