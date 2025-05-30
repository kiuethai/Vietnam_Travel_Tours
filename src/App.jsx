
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

/* Import CSS files */
import "./globals.css";
import 'rc-slider/assets/index.css';

/* Import CSS từ thư mục assets */
import "./assets/css/aos.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/flaticon.min.css";
import "./assets/css/fontawesome-5.14.0.min.css";
import "./assets/css/magnific-popup.min.css";
import "./assets/css/nice-select.min.css";
import "./assets/css/slick.min.css";
import "./assets/css/style.css"
import "~/assets/css/custom.css"


/* Import your page components here */
import About from './pages/Client/About';
import Contact from './pages/Client/Contact';
import Destination2 from './pages/Client/Destination2';
import Home from './pages/Client/Home';

import NotFound from './pages/NotFound';
import Tour_details from './pages/Client/Tour_details';
import Tour_list from '~/pages/Client/Tour_list';
import Tour_guide from './pages/Client/Tour_guide';
import Tour_sidebar from './pages/Client/Tour_sidebar';
import ReveloLayout from "./components/Client/layout/ReveloLayout";
/* Auth user */
import Auth from "./pages/Client/Auth/Auth";
import ForgotPassword from "./pages/Client/Auth/ForgotPassword";
import AccountVerification from "./pages/Client/Auth/AccountVerification";
import ResetPassword from "./components/Client/ResetPassword";


import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentAdmin } from '~/redux/admin/adminSlice'

import Settings from '~/pages/Client/Settings/Settings'
import AuthAdmin from '~/pages/Admin/Auth/AuthAdmin'
import Layout from '~/components/Admin/Layout/Layout'
import Booking from "./pages/Client/Booking";
import MyTour from "./pages/Client/MyTour";

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const ProtectedAdminRoute = ({ admin, children }) => {
  if (!admin) return <Navigate to='/admin/login' replace={true} />
  return children;
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  const currentAdmin = useSelector(selectCurrentAdmin)

  return (
    <>
      {/* Client Routes */}
      <Helmet>
        <title>KTTravel - Travel & Tour Booking</title>
        <meta
          name="description"
          content="Generated by KTTravel - Travel & Tour Booking"
        />
      </Helmet>

      <Routes>
        {/* Navigate Route*/}
        <Route path="/" element={
          <ReveloLayout header={1} footer={1}>
            <Home />
          </ReveloLayout>
        } />

        {/* Authentication */}
        <Route path="/login" element={
          <ReveloLayout header={1} footer={1}>
            <Auth />
          </ReveloLayout>

        } />

        <Route path="/register" element={
          <ReveloLayout header={1} footer={1}>
            <Auth />
          </ReveloLayout>
        } />

        <Route path='/account/verification' element={
          <ReveloLayout header={1} footer={1}>
            <AccountVerification />
          </ReveloLayout>
        } />

        <Route path="/forgot-password" element={
          <ReveloLayout header={1} footer={1}>
            <ForgotPassword />
          </ReveloLayout>
        } />

        <Route path="/account/reset-password" element={
          <ReveloLayout header={1} footer={1}>
            <ResetPassword />
          </ReveloLayout>
        } />

        {/* ProtectedRoute Routes */}
        < Route element={<ProtectedRoute user={currentUser} />}>
          {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này */}

          {/* User setting */}
          <Route path='/settings/account' element={
            <ReveloLayout header={1} footer={1}>
              <Settings />
            </ReveloLayout>
          } />

          <Route path='/settings/security' element={
            <ReveloLayout header={1} footer={1}>
              <Settings />
            </ReveloLayout>
          } />

          {/* Controller booking tour for userId */}
          <Route path="/my-tour" element={
            <ReveloLayout>
              <MyTour />
            </ReveloLayout>
          } />

        </Route>

        <Route path="/about" element={
          <ReveloLayout >
            <About />
          </ReveloLayout>
        } />

        <Route path="/tour" element={
          <ReveloLayout>
            <Tour_list />
          </ReveloLayout>
        } />

        <Route path="/tour_guide" element={<Tour_guide />} />

        <Route path="/tour-details/:id" element={
          <ReveloLayout>
            <Tour_details />
          </ReveloLayout>
        } />

        <Route path="/booking/:id" element={
          <ReveloLayout>
            <Booking />
          </ReveloLayout>
        } />

        <Route path="/contact" element={
          <ReveloLayout insta>
            <Contact />
          </ReveloLayout>
        } />

        <Route path="/destination" element={
          <ReveloLayout>
            <Destination2 />
          </ReveloLayout>
        } />

        <Route path="/tour_sidebar" element={<Tour_sidebar />} />

        {/* Admin Routes */}
        <Route path='/admin'>

          <Route index element={currentAdmin ?
            <Navigate to='/admin/dashboard' replace /> : <Navigate to='/admin/login' replace />} />

          <Route path='*' element={
            <ProtectedAdminRoute admin={currentAdmin}>
              <Layout />
            </ProtectedAdminRoute>
          } />

          <Route path='login' element={currentAdmin ?
            <Navigate to='/admin/dashboard' replace /> : <AuthAdmin />} />

          {/* Add other admin routes here */}
          <Route path='/admin/*' element={
            <ProtectedAdminRoute admin={currentAdmin}>
              <Layout />
            </ProtectedAdminRoute>
          } />


        </Route>

        <Route path="*" element={
          <ReveloLayout>
            <NotFound />
          </ReveloLayout>
        } />

      </Routes>
    </>
  );

}

export default App;