/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState, useMemo, useCallback } from 'react'
import { getAllUsersAPI, UpdateUserAPI } from '~/apis'
import {
  Grid,
  Box,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField as Input,
  CircularProgress,
} from '@mui/material'
import moment from 'moment'
import Widget from '~/components/Admin/Widget/Widget'
import { Button } from '~/components/Admin/Wrappers/Wrappers'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Notification from '~/components/Admin/Notification/Notification'
import { toast } from 'react-toastify'

import { Typography, Chip, Avatar } from '~/components/Admin/Wrappers/Wrappers'
import {
  useManagementDispatch,
  useManagementState,
} from '~/context/ManagementContext'

import useStyles from './styles'

import { actions } from '~/context/ManagementContext'
import { getComparator, stableSort } from '~/utils/arrange'


const headCells = [
  { id: 'index', numeric: false, disablePadding: false, label: 'STT' },
  { id: 'avatar', numeric: false, disablePadding: false, label: 'AVATAR' },
  { id: 'displayName', numeric: false, disablePadding: false, label: 'DISPLAY NAME' },
  { id: 'username', numeric: false, disablePadding: false, label: 'USERNAME' },
  { id: 'email', numeric: false, disablePadding: false, label: 'EMAIL' },
  { id: 'address', numeric: false, disablePadding: false, label: 'ADDRESS' },
  { id: 'isActive', numeric: false, disablePadding: false, label: 'KÍCH HOẠT' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'ACTIONS' },
];

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
    numSelected,
    onRequestSort,
  } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography
                noWrap
                weight={'medium'}
                variant={'body2'}
              >
                {headCell.label}
              </Typography>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const UserList = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('calories')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [usersRows, setUsersRows] = useState([])
  const [loading, setLoading] = useState(false)

  const managementDispatch = useManagementDispatch()
  const managementValue = useManagementState()
  const classes = useStyles();

  const openModal = useCallback(id => actions.doOpenConfirm(id)(managementDispatch), [managementDispatch])
  const closeModal = useCallback(() => actions.doCloseConfirm()(managementDispatch), [managementDispatch])

  const sortedAndPaginatedRows = useMemo(() =>
    stableSort(usersRows, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [usersRows, order, orderBy, page, rowsPerPage]
  );

  const emptyRowsInCurrentPage = useMemo(() =>
    rowsPerPage - Math.min(rowsPerPage, usersRows.length - page * rowsPerPage),
    [rowsPerPage, usersRows.length, page]
  );

  const handleDelete = async () => {
    try {
      setLoading(true);
      const userId = managementValue.idToDelete;

      if (!userId || typeof userId !== 'string' || userId.length !== 24) {
        sendNotification('ID người dùng không hợp lệ');
        closeModal();
        return;
      }

      await UpdateUserAPI(userId, { _destroy: true });
      await fetchListUsers();
      closeModal();
      sendNotification('User deleted successfully');
    } catch (error) {
      sendNotification('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (userId) => {
    try {
      setLoading(true);
      if (!userId || typeof userId !== 'string' || userId.length !== 24) {
        sendNotification('ID người dùng không hợp lệ');
        return;
      }

      await UpdateUserAPI(userId, { isActive: true });
      await fetchListUsers();
      sendNotification('User activated successfully');
    } catch (error) {
      sendNotification('Failed to activate user');
    } finally {
      setLoading(false);
    }
  };

  const fetchListUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersAPI();
      setUsersRows(Array.isArray(res) ? res : []);
    } catch (error) {
      sendNotification('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListUsers();
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

  const handleSelectAllClick = useCallback(event => {
    setSelected(event.target.checked
      ? managementValue.rows.map(n => n.id)
      : []);
  }, [managementValue.rows]);

  const handleClick = useCallback((event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, name];
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

  const isSelected = useCallback(name => selected.indexOf(name) !== -1, [selected]);

  return (
    <Grid container spacing={3}>
      <Dialog
        open={managementValue.modalOpen}
        onClose={closeModal}
        scroll={"body"}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Bạn có chắc chắn muốn xóa người dùng không?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Người dùng sẽ bị xóa.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeModal}
            color="primary"
          >
            Không đồng ý
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      {/* Tiêu đề trang */}
      <Box p={5}>
        <Typography variant="h5" weight="bold">
          Quản lý người dùng
        </Typography>
      </Box>
      <Grid item xs={12}>
        <Widget inheritHeight noBodyPadding>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={usersRows.length}
                />
                <TableBody>
                  {sortedAndPaginatedRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id)
                    const labelId = `enhanced-table-checkbox-${index}`
                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row._id || index}
                        selected={isItemSelected}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="0"
                          align="left"
                        >
                          <Typography
                            variant={'body2'}
                            sx={{ padding: 0, margin: 2 }}
                          >
                            {index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            marginLeft={3}
                          >
                            <Avatar
                              alt={row.displayName}
                              src={row.avatar}
                              style={{
                                marginRight: 15,
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                          >
                            <Typography
                              variant={'body2'}
                              noWrap
                            >
                              {row.displayName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Typography
                            variant={'body2'}
                          >
                            {row.username}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography
                            variant={'body2'}
                          >
                            {row.email}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography
                            variant={'body2'}
                          >
                            {row.address}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Chip
                            label={row.isActive ? 'Active' : 'Inactive'}
                            style={{
                              color: '#fff',
                              height: 16,
                              backgroundColor: row.isActive ? '#3CD4A0' : '#FF5C93',
                              fontSize: 11,
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <Box
                            display={'flex'}
                            style={{
                              marginLeft: -12,
                            }}
                          >
                            {!row.isActive && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  activateUser(row._id);
                                }}
                                variant="contained"
                                color="primary"
                                style={{ marginRight: 8 }}
                              >
                                Activate
                              </Button>
                            )}
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(row._id);
                              }}
                              color={'primary'}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {emptyRowsInCurrentPage > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRowsInCurrentPage }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={usersRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Widget>
      </Grid>
    </Grid>
  );
};

export default UserList;
