import React from 'react'
// import { useInView } from 'react-intersection-observer'
import Counter from "../../src/components/Counter";
import SearchFilter from "../../src/components/SearchFilter";
import SectionTitle from "../../src/components/SectionTitle";
import Testimonial from "../../src/components/slider/Testimonial";
import ReveloLayout from '../../src/components/layout/ReveloLayout'
import { Link } from 'react-router-dom';
import 'aos/dist/aos.css'; // Nếu sử dụng AOS animation
import Header1 from '../components/layout/Header/Header1';
import Footer1 from '../components/layout/Footer/Footer1';

function Home() {
  // // Khởi tạo AOS
  // useEffect(() => {
  //   AOS.init({
  //     duration: 1500,
  //     once: true,
  //     offset: 50
  //   });
  // }, []);

  // // Sử dụng Intersection Observer thay thế
  // const { ref: sectionRef, inView: sectionInView } = useInView({
  //   triggerOnce: true,
  //   threshold: 0.1
  // })

  return (
    <div>
      <Header1 />
      {/* Hero Area Start */}
      <section className="hero-area bgc-black pt-200 rpt-120 rel z-2">
        <div className="container-fluid">
          <h1
            className="hero-title"
            data-aos="flip-up"
            data-aos-delay={50}
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            tour &amp; Travel
          </h1>
          <div
            className="main-hero-image bgs-cover"
            style={{ backgroundImage: "url(assets/images/hero/hero.jpg)" }}
          />
        </div>
        <SearchFilter />
      </section>
      {/* Hero Area End */}
    
      <Footer1 />
    </div>

  )
}

export default Home