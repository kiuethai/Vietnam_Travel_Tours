import Header1 from "./Header/Header1";
import Header2 from "./Header/Header2";
import Header3 from "./Header/Header3";



const Header = ({ header }) => {
  const sidebarClick = () =>
    document.querySelector("body").classList.toggle("side-content-visible");

  switch (header) {
    case 1:
      return <Header1 sidebarClick={sidebarClick} />;
    case 2:
      return <Header2 sidebarClick={sidebarClick} />;
    default:
      return <Header3 sidebarClick={sidebarClick} />;
  }
};
export default Header;






