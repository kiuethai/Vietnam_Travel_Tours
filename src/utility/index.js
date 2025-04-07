import AOS from 'aos';

export const roveloUtility = {
  animation() {
    AOS.init({
      duration: 1000,
      once: true
    });
  },
  
  fixedHeader() {
    const handleScroll = () => {
      const header = document.querySelector(".main-header");
      if (!header) return;
      header.classList.toggle("fixed-header", window.scrollY >= 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }
};

// Xóa toàn bộ phần niceSelect cũ (sẽ dùng react-select thay thế)