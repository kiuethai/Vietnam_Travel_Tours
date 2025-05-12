import React, { useState, useEffect } from "react";
import {
  Grid,
  LinearProgress,
  Select,
  OutlinedInput,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TablePagination,
  TableHead,
  TableSortLabel,
  Toolbar,
  IconButton, Menu
} from "@mui/material";
import { useTheme, makeStyles } from '@mui/styles';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts";

// styles
import useStyles from "./styles";

// components
import Widget from "~/components/Admin/Widget/Widget";
import { Chip, Typography, Avatar } from "~/components/Admin/Wrappers/Wrappers";
import Dot from "~/components/Admin/Sidebar/components/Dot";
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon, MoreVert as MoreIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";

import { lighten } from '@mui/material/styles';
import cn from "classnames";
import { getDashboardAllDataAPI } from "~/apis";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: "id", numeric: true, disablePadding: true, label: "Mã đặt tour" },
  { id: "customer", numeric: true, disablePadding: false, label: "Khách hàng" },
  { id: "tour", numeric: true, disablePadding: false, label: "Tour" },
  { id: "adults", numeric: true, disablePadding: false, label: "Người lớn" },
  { id: "children", numeric: true, disablePadding: false, label: "Trẻ em" },
  { id: "price", numeric: true, disablePadding: false, label: "Tổng tiền" },
  { id: "date", numeric: true, disablePadding: false, label: "Ngày đặt" },
  { id: "status", numeric: true, disablePadding: false, label: "Trạng thái" },
  { id: "actions", numeric: true, disablePadding: false, label: "Thao tác" }
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all rows" }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "right"}
            padding={headCell.disablePadding ? "none" : null}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
              style={{
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                fontSize: "0.85rem",
              }}
            >
              <Typography uppercase color="text" variant={"body2"} colorBrightness="hint">{headCell.label}</Typography>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected, totalBookings } = props;

  return (
    <Toolbar
      className={cn(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} đã chọn
        </Typography>
      ) : (
        <Box display={"flex"} className={classes.title}>
          <Typography
            variant="h6"
            color="text"
            colorBrightness={"secondary"}
            id="tableTitle"
            style={{ display: "flex" }}
            block
          >
            Đặt tour gần đây
            <Box display="flex" alignSelf={"flex-end"} ml={1}>
              <Typography
                color="text"
                colorBrightness={"hint"}
                variant={"caption"}
              >
                {totalBookings} tổng số
              </Typography>
            </Box>
          </Typography>
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xóa">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Lọc danh sách">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  totalBookings: PropTypes.number.isRequired
};

function Dashboard() {
  let classes = useStyles();
  let theme = useTheme();

  // local
  let [mainChartState, setMainChartState] = useState("monthly");

  // Recent Orders table
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("createdAt");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [actionsButtonRefID, setActionsButtonRefID] = React.useState(null);
  const [isActionsMenu, setActionsMenu] = React.useState(false);

  const [dashboardData, setDashboardData] = useState({
    summary: { userCount: 0, tourCount: 0, bookingCount: 0 },
    dataDomain: { values: [0, 0, 0] },
    paymentMethods: { labels: [], counts: [], revenue: [], totalRevenue: 0 },
    toursBooked: [],
    newBooking: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardAllDataAPI();
        setDashboardData(data);
        console.log("Dashboard data:", data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = dashboardData.newBooking.map(n => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = id => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dashboardData.newBooking.length - page * rowsPerPage);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'completed': return 'primary';
      case 'cancelled': return 'secondary';
      default: return 'default';
    }
  };

  // Prepare data for payment methods chart
  const paymentChartData = dashboardData.paymentMethods.labels.map((label, index) => ({
    name: label,
    value: dashboardData.paymentMethods.revenue[index],
    color: index === 0 ? 'primary' : index === 1 ? 'secondary' : 'warning'
  }));

  // Format currency to VND
  const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={4} sm={6} xs={12}>
        <Widget
          title="Thống kê người dùng"
          bodyClass={classes.fullHeightBody}
          className={classes.card}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={6}>
              <Box display="flex">
                <Typography variant="h2" weight="medium">
                  {dashboardData.summary.userCount}
                </Typography>
                <Typography
                  color="text"
                  variant={"caption"}
                  noWrap
                  style={{ alignSelf: "flex-end", marginLeft: 8 }}
                >
                  Người dùng
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Người dùng", value: dashboardData.summary.userCount, color: "primary" }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill={theme.palette.primary.main} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography color="text" colorBrightness={"secondary"}>
              Người dùng hoạt động
            </Typography>
            <Typography variant="h6">
              {dashboardData.summary.userCount}
            </Typography>
          </Box>
        </Widget>
      </Grid>
      <Grid item lg={4} sm={6} xs={12}>
        <Widget
          title="Tour & Đặt tour"
          className={classes.card}
          bodyClass={classes.fullHeightBody}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h2" weight="medium">
                  {dashboardData.summary.tourCount}
                </Typography>
                <Typography color="text" colorBrightness={"hint"}>
                  Tổng số tour
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h2" weight="medium">
                  {dashboardData.summary.bookingCount}
                </Typography>
                <Typography color="text" colorBrightness={"hint"}>
                  Tổng số đặt tour
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box mt={2}>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart
                data={[
                  { name: "Tour", value: dashboardData.summary.tourCount, fill: theme.palette.primary.main },
                  { name: "Đặt tour", value: dashboardData.summary.bookingCount, fill: theme.palette.success.main }
                ]}
              >
                <Bar dataKey="value" fill="#8884d8" />
                <XAxis dataKey="name" />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Widget>
      </Grid>
      <Grid item lg={4} sm={6} xs={12}>
        <Widget
          title="Tổng doanh thu"
          className={classes.card}
          bodyClass={classes.fullHeightBody}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <Typography variant="h2" weight="medium">
              {formatToVND(dashboardData.paymentMethods.totalRevenue)}
            </Typography>
          </Box>
          <Grid container spacing={1}>
            {dashboardData.paymentMethods.labels.map((label, index) => (
              <Grid item xs={12} key={label}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Dot color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'warning'} />
                    <Typography variant="body2" style={{ marginLeft: 8 }}>
                      {label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" weight="medium">
                    {formatToVND(dashboardData.paymentMethods.revenue[index])}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(dashboardData.paymentMethods.revenue[index] / dashboardData.paymentMethods.totalRevenue) * 100}
                  classes={{
                    barColorPrimary: index === 0 ? classes.progressBarPrimary :
                      index === 1 ? classes.progressBarSecondary :
                        classes.progressBarWarning
                  }}
                  className={classes.progress}
                  style={{ marginBottom: 8 }}
                />
              </Grid>
            ))}
          </Grid>
        </Widget>
      </Grid>
      <Grid item xs={12}>
        <Widget
          bodyClass={classes.mainChartBody}
          header={
            <div className={classes.mainChartHeader}>
              <Typography
                variant="h6"
                color="text"
                weight={"medium"}
                colorBrightness="secondary"
              >
                Phân bổ phương thức thanh toán
              </Typography>
              <div className={classes.mainChartHeaderLabels}>
                {dashboardData.paymentMethods.labels.map((label, index) => (
                  <div className={classes.mainChartHeaderLabel} key={label}>
                    <Dot color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'warning'} />
                    <Typography className={classes.mainChartLegendElement}>
                      {label}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <ResponsiveContainer width="100%" minWidth={500} height={350}>
            <PieChart>
              <Pie
                data={paymentChartData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {paymentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.palette[entry.color].main} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatToVND(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Widget>
      </Grid>
      {dashboardData.toursBooked.map((tour, index) => (
        <Grid item md={3} sm={6} xs={12} key={tour._id}>
          <Widget
            title={tour.title}
            upperTitle
            className={classes.card}
            bodyClass={classes.fullHeightBody}
          >
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
              <Typography variant="h1" weight="medium">
                {tour.bookingCount}
              </Typography>
              <Typography color="text" colorBrightness={"secondary"}>
                Lượt đặt
              </Typography>
            </Box>
          </Widget>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Widget noBodyPadding bodyClass={classes.tableWidget}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            totalBookings={dashboardData.newBooking.length}
          />
          <div className={classes.tableWrapper}>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="recent orders"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={dashboardData.newBooking.length}
              />
              <TableBody>
                {stableSort(dashboardData.newBooking, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking, index) => {
                    const isItemSelected = isSelected(booking._id);
                    const labelId = `bookings-table-checkbox-${index}`;
                    // Find the tour that matches this booking
                    const tour = dashboardData.toursBooked.find(t => t._id === booking.tourId) || { title: 'Unknown Tour' };

                    return (
                      <TableRow
                        hover
                        onClick={event => handleClick(event, booking._id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={booking._id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {booking._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <Box
                            display={"flex"}
                            flexWrap={"nowrap"}
                            alignItems={"center"}
                          >
                            <Avatar
                              alt={booking.fullName}
                              color="primary"
                              style={{ marginRight: 8 }}
                            >
                              {booking.fullName[0]}
                            </Avatar>
                            <Typography style={{ whiteSpace: "nowrap" }}>
                              {booking.fullName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{tour.title.length > 30 ? tour.title.substring(0, 30) + '...' : tour.title}</TableCell>
                        <TableCell>{booking.numAdults}</TableCell>
                        <TableCell>{booking.numChildren}</TableCell>
                        <TableCell>{formatToVND(booking.totalPrice)}</TableCell>
                        <TableCell>{formatDate(booking.createdAt)}</TableCell>
                        <TableCell>
                          <Chip label={
                            booking.status === 'pending' ? 'Chờ xác nhận' :
                              booking.status === 'confirmed' ? 'Đã xác nhận' :
                                booking.status === 'completed' ? 'Hoàn thành' :
                                  booking.status === 'cancelled' ? 'Đã hủy' :
                                    booking.status
                          } color={getStatusColor(booking.status)} />
                        </TableCell>
                        <TableCell align={"center"}>
                          <IconButton
                            className={classes.actionsIcon}
                            aria-owns="actions-menu"
                            aria-haspopup="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionsMenu(true);
                              setActionsButtonRefID(e.currentTarget)
                            }}
                          >
                            <MoreIcon />
                          </IconButton>

                          <Menu
                            id="actions-menu"
                            open={isActionsMenu}
                            anchorEl={actionsButtonRefID}
                            onClose={() => setActionsMenu(false)}
                            disableAutoFocusItem
                          >
                            <MenuItem>
                              <Typography>Xem chi tiết</Typography>
                            </MenuItem>
                            <MenuItem>
                              <Typography>Cập nhật trạng thái</Typography>
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={9} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dashboardData.newBooking.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Trang trước"
            }}
            nextIconButtonProps={{
              "aria-label": "Trang sau"
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng/trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count !== -1 ? count : `nhiều hơn`}`}
          />
        </Widget>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
