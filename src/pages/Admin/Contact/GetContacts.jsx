/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllContactAPI, replyUserAPI } from '~/apis'
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
import Notification from '~/components/Admin/Notification/Notification'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import useStyles from '~/pages/Admin/Tours/styles'
import { getComparator, stableSort } from '~/utils/arrange'
import EnhancedTableHead from '~/components/Admin/Tour/EnhancedTableHead'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Typography from '@mui/material/Typography';

// Initialize default column widths - these values can be adjusted
const defaultColumnWidths = {
  index: 60,
  fullName: 160,
  phoneNumber: 120,
  email: 250,
  message: 220,
  createdAt: 110,
  repliedAt: 110,
  reply: 140,
  ACTIONS: 120,
};

const headCells = [
  { id: 'index', label: 'STT' },
  { id: 'fullName', label: 'Tên khách hàng' },
  { id: 'phoneNumber', label: 'Số điện thoại' },
  { id: 'email', label: 'Email' },
  { id: 'message', label: 'Nội dung' },
  { id: 'createdAt', label: 'Ngày gửi' },
  { id: 'repliedAt', label: 'Phản hồi lúc' },
  { id: 'reply', label: 'Nội dung phản hồi' },
  { id: 'ACTIONS', label: 'Hành Động' },
];

function GetContacts() {
  const navigate = useNavigate()
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('title')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [contactRows, setContactRows] = useState([]);
  const [loading, setLoading] = useState(false)
  const [columnWidths, setColumnWidths] = useState({ ...defaultColumnWidths })
  const [replyingId, setReplyingId] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const classes = useStyles()

  const sortedAndPaginatedRows = useMemo(() =>
    stableSort(contactRows, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [contactRows, order, orderBy, page, rowsPerPage]
  );

  const emptyRowsInCurrentPage = useMemo(() =>
    rowsPerPage - Math.min(rowsPerPage, contactRows.length - page * rowsPerPage),
    [rowsPerPage, contactRows.length, page]
  );

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await getAllContactAPI();
      setContactRows(Array.isArray(res.contacts) ? res.contacts : []);
    } catch (error) {
      sendNotification('Không thể tải dữ liệu liên hệ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
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

  const handleColumnResize = useCallback((columnId, width) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: width
    }));
  }, []);

  const onEditorStateChange = (state) => setEditorState(state);

  const handleReply = async (row) => {
    setReplyingId(row?._id);
    setEditorState(EditorState.createEmpty());
  };

  const handleSendReply = async () => {
    setLoading(true);
    try {
      const replyContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      await replyUserAPI({
        contactId: replyingId,
        reply: replyContent,
      });
      sendNotification('Đã phản hồi liên hệ');
      setReplyingId(null);
      fetchContacts();
    } catch {
      sendNotification('Lỗi phản hồi liên hệ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Widget inheritHeight noBodyPadding>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                    rowCount={contactRows.length}
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
                          <TableCell align="left" style={{ width: columnWidths['fullName'] }}>{row.fullName}</TableCell>
                          <TableCell align="left" style={{ width: columnWidths['phoneNumber'] }}>{row.phoneNumber}</TableCell>
                          <TableCell align="left" style={{ width: columnWidths['email'] }}>{row.email}</TableCell>
                          <TableCell align="left" style={{ width: columnWidths['message'] }}>{row.message}</TableCell>
                          <TableCell align="left" style={{ width: columnWidths['createdAt'] }}>
                            {row.createdAt ? moment(row.createdAt).format('DD/MM/YYYY HH:mm') : ''}
                          </TableCell>
                          <TableCell align="left" style={{ width: columnWidths['repliedAt'] }}>
                            {row.repliedAt ? moment(row.repliedAt).format('DD/MM/YYYY HH:mm') : 'Chưa phản hồi'}
                          </TableCell>
                          <TableCell align="left" style={{ width: columnWidths['reply'] }}>
                            {row?.reply ? (
                              <span dangerouslySetInnerHTML={{ __html: row.reply }} />
                            ) : (
                              'Chưa phản hồi'
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {!row.repliedAt ? (
                              <MenuItem
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleReply(row);
                                }}
                                style={{ backgroundColor: '#333', color: '#fff' }}
                              >
                                Phản hồi
                              </MenuItem>
                            ) :
                              (
                                <MenuItem
                                  size="small"
                                  color="primary"
                                  variant="contained"
                                  style={{ backgroundColor: '#000000', color: '#fff' }}
                                  disabled
                                >
                                  Đã phản hồi
                                </MenuItem>
                              )

                            }
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRowsInCurrentPage > 0 && (
                      <TableRow style={{ height: (dense ? 33 : 53) * emptyRowsInCurrentPage }}>
                        <TableCell colSpan={8} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={contactRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              {replyingId && (
                <Grid item xs={12} style={{ marginTop: '20px' }}>
                  <Box sx={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    mb: 2
                  }}>
                    <Typography variant="body1" component="label" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
                      Phản hồi liên hệ {contactRows.find(c => c._id === replyingId)?.email || ''}
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
                    <Box mt={2} display="flex" gap={2}>
                      <MenuItem
                        color="primary"
                        variant="contained"
                        onClick={handleSendReply}
                        style={{ color: '#fff', backgroundColor: '#2272bb', borderRadius: '10px' }}
                      >
                        Gửi phản hồi
                      </MenuItem>
                      <MenuItem
                        color="secondary"
                        variant="outlined"
                        onClick={() => setReplyingId(null)}
                        style={{ color: '#fff', backgroundColor: '#e72626', border: '1px solid', borderRadius: '8px' }}
                      >
                        Hủy
                      </MenuItem>
                    </Box>
                  </Box>
                </Grid>
              )}
            </>
          )}

        </Widget>
      </Grid>
    </Grid>
  );
}

export default GetContacts
