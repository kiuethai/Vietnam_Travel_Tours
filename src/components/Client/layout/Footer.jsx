import { Link } from 'react-router-dom';
import Footer1 from "./Footer/Footer1";
import Footer2 from './Footer/Footer2';

const Footer = ({ footer, insta }) => {
  switch (footer) {
    case 1:
      return <Footer1 />;

    default:
      return <Footer2 insta={insta} />;
  }
};
export default Footer;

