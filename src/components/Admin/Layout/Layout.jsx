import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import classnames from 'classnames';

import GithubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

import { Fab, IconButton } from '@mui/material';
import { connect } from 'react-redux';
// styles
import useStyles from './styles';

// components
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import { Link } from '../Wrappers/Wrappers';
import ColorChangeThemePopper from './components/ColorChangeThemePopper';


// pages
import Dashboard from '~/pages/Admin/dashboard/Dashboard'

// import Ecommerce from '../../pages/ecommerce'
// import Product from '../../pages/ecommerce/Products'
// import ProductsGrid from '../../pages/ecommerce/ProductsGrid'
// import CreateProduct from '../../pages/ecommerce/CreateProduct'


import BreadCrumbs from '~/components/Admin/BreadCrumbs/index'

// context
import { useLayoutState } from '~/context/LayoutContext';
// import { ProductsProvider } from '~/context/ProductContext'

// import UsersFormPage from 'pages/CRUD/Users/form/UsersFormPage';
// import UsersTablePage from 'pages/CRUD/Users/table/UsersTablePage';

//Sidebar structure
import structure from '../Sidebar/SidebarStructure'
import Profile from '~/pages/Admin/profile/Profile';
import UserList from '~/pages/Admin/user/UserList';
import AddTour from '~/pages/Admin/Tours/AddTours';
import GetTour from '~/pages/Admin/Tours/GetTour';
import UpdateTour from '~/pages/Admin/Tours/UpdateTour';
import GetBookings from '~/pages/Admin/Booking/GetBookings';

function Layout(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'add-section-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  // global
  let layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar structure={structure} />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        {/* <BreadCrumbs /> */}
        <Routes>
          <Route path='dashboard' element={<Dashboard />} />

          <Route path="profile/*" element={<Profile />} />

          <Route path='users' element={<UserList />} />

          <Route path="tours/addtours" element={<AddTour />} />

          <Route path="tours/getAllTour" element={<GetTour />} />

          <Route path="tours/getAllTour/edit/:id" element={<UpdateTour />} />
          
          <Route path="bookings" element={<GetBookings />} />

          {/* <Route path="/app/ecommerce/management" exact>
            <ProductsProvider>
              <Ecommerce />
            </ProductsProvider>
          </Route>
          <Route path="/app/ecommerce/management/edit/:id" exact>
            <ProductsProvider>
              <CreateProduct />
            </ProductsProvider>
          </Route>
          <Route path="/app/ecommerce/management/create">
            <ProductsProvider>
              <CreateProduct />
            </ProductsProvider>
          </Route>
          <Route path="/app/ecommerce/product/:id" component={Product}/>
          <Route path="/app/ecommerce/product" component={Product} />
          <Route path="/app/ecommerce/gridproducts" component={ProductsGrid}/>

        
          <Route path={'/app/users'} exact component={UsersTablePage} />
          <Route path={'/app/user/new'} exact component={UsersFormPage} />
          <Route
            path={'/app/users/:id/edit'}
            exact
            component={UsersFormPage}
          /> */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>

        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
        <Footer>
          <div>
          </div>
          <div>
            <Link to={'https://www.facebook.com/kieuthaizz'} target={'_blank'}>
              <IconButton aria-label='facebook'>
                <FacebookIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link to={'#'} target={'_blank'}>
              <IconButton aria-label='twitter'>
                <TwitterIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link to={'https://github.com/kiuethai'} target={'_blank'}>
              <IconButton
                aria-label='github'
                style={{ padding: '12px 0 12px 12px' }}
              >
                <GithubIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
          </div>
        </Footer>
      </div>
    </div>
  );
}

export default connect()(Layout);