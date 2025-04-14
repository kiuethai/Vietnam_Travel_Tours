import React from "react";

// Import header and footer components if needed
// import Header from "./Header";
// import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
