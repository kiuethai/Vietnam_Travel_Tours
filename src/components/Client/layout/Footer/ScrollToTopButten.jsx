"use client"; // Bắt buộc nếu dùng Next.js App Router

import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Cuộn mượt
    });
  };

  return (
    <button
      className={`scroll-top scroll-to-target ${isVisible ? "visible" : "hidden"}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <img src="/assets/images/icons/scroll-up.png" alt="Scroll Up" />
    </button>
  );
}