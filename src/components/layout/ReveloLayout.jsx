import React, { useEffect } from 'react';
import EmbedPopup from "../popup/EmbedPopup";
import ImageView from "../popup/ImageView";
import { roveloUtility } from "../../utility";
import Footer from "./Footer";
import Header from "./Header";

const ReveloLayout = ({ children, header, footer, insta, sideBar }) => {
  useEffect(() => {
    const cleanupAnimation = roveloUtility.animation();
    const cleanupHeader = roveloUtility.fixedHeader();
    
    return () => {
      cleanupAnimation?.();
      cleanupHeader?.();
    };
  }, []);

  return (
    <div className={`page-wrapper ${sideBar ? "for-sidebar-menu" : ""}`}>
      <EmbedPopup />
      <ImageView />
      <Header header={header} />
      {children}
      <Footer footer={footer} insta={insta} />
    </div>
  );
};

export default ReveloLayout;