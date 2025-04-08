



{/* Testimonials Area start */ }
<section className="testimonials-area rel z-1">
  <div className="container">
    <div className="testimonials-wrap bgc-lighter">
      <div className="row">
        <div
          className="col-lg-5 rel"
          data-aos="fade-right"
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <div
            className="testimonial-left-image rmb-55"
            style={{
              backgroundImage:
                "url(assets/images/testimonials/testimonial-left.jpg)",
            }}
          />
        </div>
        <div className="col-lg-7">
          <div
            className="testimonial-right-content"
            data-aos="fade-left"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <div className="section-title mb-55">
              <h2>
                <span>5280</span> Global Clients Say About Us Services
              </h2>
            </div>
            <Testimonial />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* Testimonials Area end */ }

{/* CTA Area start */ }
<section className="cta-area pt-100 rel z-1">
  <div className="container-fluid">
    <div className="row">
      <div
        className="col-xl-4 col-md-6"
        data-aos="zoom-in-down"
        data-aos-duration={1500}
        data-aos-offset={50}
      >
        <div
          className="cta-item"
          style={{ backgroundImage: "url(assets/images/cta/cta1.jpg)" }}
        >
          <span className="category">Tent Camping</span>
          <h2>Explore the world best tourism</h2>
          <Link
            to="/tour-details"
            className="theme-btn style-two bgc-secondary"
          >
            <span data-hover="Explore Tours">Explore Tours</span>
            <i className="fal fa-arrow-right" />
          </Link>
        </div>
      </div>
      <div
        className="col-xl-4 col-md-6"
        data-aos="zoom-in-down"
        data-aos-delay={50}
        data-aos-duration={1500}
        data-aos-offset={50}
      >
        <div
          className="cta-item"
          style={{ backgroundImage: "url(assets/images/cta/cta2.jpg)" }}
        >
          <span className="category">Sea Beach</span>
          <h2>World largest Sea Beach in Thailand</h2>
          <Link to="/tour-details" className="theme-btn style-two">
            <span data-hover="Explore Tours">Explore Tours</span>
            <i className="fal fa-arrow-right" />
          </Link>
        </div>
      </div>
      <div
        className="col-xl-4 col-md-6"
        data-aos="zoom-in-down"
        data-aos-delay={100}
        data-aos-duration={1500}
        data-aos-offset={50}
      >
        <div
          className="cta-item"
          style={{ backgroundImage: "url(assets/images/cta/cta3.jpg)" }}
        >
          <span className="category">Water Falls</span>
          <h2>Largest Water falls Bali, Indonesia</h2>
          <Link
            to="/tour-details"
            className="theme-btn style-two bgc-secondary"
          >
            <span data-hover="Explore Tours">Explore Tours</span>
            <i className="fal fa-arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
{/* CTA Area end */ }

{/* Blog Area start */ }
<section className="blog-area py-70 rel z-1">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-12">
        <div
          className="section-title text-center counter-text-wrap mb-70"
          data-aos="fade-up"
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <SectionTitle
            title={"Read Latest News & Blog"}
            subtitle2="most popular experience you’ll remember"
          />
        </div>
      </div>
    </div>
    <div className="row justify-content-center">
      <div className="col-xl-4 col-md-6">
        <div
          className="blog-item"
          data-aos="fade-up"
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <div className="content">
            <Link to="/blog" className="category">
              Travel
            </Link>
            <h5>
              <Link to="/blog-details">
                Ultimate Guide to Planning Your Dream Vacation with Ravelo
                Travel Agency
              </Link>
            </h5>
            <ul className="blog-meta">
              <li>
                <i className="far fa-calendar-alt" />{" "}
                <a href="#">25 February 2024</a>
              </li>
              <li>
                <i className="far fa-comments" />{" "}
                <a href="#">Comments (5)</a>
              </li>
            </ul>
          </div>
          <div className="image">
            <img src="assets/images/blog/blog1.jpg" alt="Blog" />
          </div>
          <Link to="/blog-details" className="theme-btn">
            <span data-hover="Book Now">Read More</span>
            <i className="fal fa-arrow-right" />
          </Link>
        </div>
      </div>
      <div className="col-xl-4 col-md-6">
        <div
          className="blog-item"
          data-aos="fade-up"
          data-aos-delay={50}
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <div className="content">
            <Link to="/blog" className="category">
              Travel
            </Link>
            <h5>
              <Link to="/blog-details">
                Unforgettable Adventures Travel Agency Bucket List
                Experiences
              </Link>
            </h5>
            <ul className="blog-meta">
              <li>
                <i className="far fa-calendar-alt" />{" "}
                <a href="#">25 February 2024</a>
              </li>
              <li>
                <i className="far fa-comments" />{" "}
                <a href="#">Comments (5)</a>
              </li>
            </ul>
          </div>
          <div className="image">
            <img src="assets/images/blog/blog2.jpg" alt="Blog" />
          </div>
          <Link to="/blog-details" className="theme-btn">
            <span data-hover="Book Now">Read More</span>
            <i className="fal fa-arrow-right" />
          </Link>
        </div>
      </div>
      <div className="col-xl-4 col-md-6">
        <div
          className="blog-item"
          data-aos="fade-up"
          data-aos-delay={100}
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <div className="content">
            <Link to="/blog" className="category">
              Travel
            </Link>
            <h5>
              <Link to="/blog-details">
                Exploring Culture and way Cuisine Travel Agency's they
                Best Foodie Destinations
              </Link>
            </h5>
            <ul className="blog-meta">
              <li>
                <i className="far fa-calendar-alt" />{" "}
                <a href="#">25 February 2024</a>
              </li>
              <li>
                <i className="far fa-comments" />{" "}
                <a href="#">Comments (5)</a>
              </li>
            </ul>
          </div>
          <div className="image">
            <img src="assets/images/blog/blog3.jpg" alt="Blog" />
          </div>
          <Link to="/blog-details" className="theme-btn">
            <span data-hover="Book Now">Read More</span>
            <i className="fal fa-arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>