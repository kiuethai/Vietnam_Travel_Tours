import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import classnames from 'classnames';

import SettingsIcon from '@mui/icons-material/Settings';
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

const Redirect = (props) => {
  useEffect(() => window.location.replace(props.url));
  return <span>Redirecting...</span>;
};

function Layout(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
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
        <BreadCrumbs />
        <Routes>
          <Route path='dashboard' element={<Dashboard />} />


          {/* <Route path="/app/profile" component={Profile} /> */}
          {/* <Route path='/app/user/edit' component={EditUser} /> */}


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
        <Fab
          color='primary'
          aria-label='settings'
          onClick={(e) => handleClick(e)}
          className={classes.changeThemeFab}
          style={{ zIndex: 100 }}
        >
          <SettingsIcon style={{ color: '#fff' }} />
        </Fab>
        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
        <Footer>
          <div>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/about'}
              target={'_blank'}
              className={classes.link}
            >
              About Us
            </Link>
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