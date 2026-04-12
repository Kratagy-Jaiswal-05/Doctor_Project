import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* HERO */}
      <div className="hero-section d-flex align-items-center">
        <div className="container d-flex align-items-center justify-content-between">

          <div className="hero-text">
            <h1>
              Find the Best <span>Doctors</span><br />
              In Your City
            </h1>

            <p>
              Book appointments with top specialists instantly and effortlessly.
            </p>

            <div className="mt-4">
              <Link to="/book" className="btn btn-light me-3 px-4 py-2">
                Book Appointment
              </Link>

              <Link to="/login" className="btn btn-outline-light px-4 py-2">
                Login
              </Link>
            </div>
          </div>

          <div className="hero-img-wrapper">
            <img src="/img/team-1.jpg" alt="doctor" className="hero-img" />
          </div>

        </div>
      </div>

      {/* ABOUT */}
      <div className="about-section container mt-5 d-flex align-items-center justify-content-between">

        <img src="/img/blog-1.jpg" className="about-img" alt="about" />

        <div className="about-text ms-4">
          <h6 className="text-primary">ABOUT US</h6>
          <h2>Best Medical Care For Yourself and Your Family</h2>

          <p>
            We provide top quality healthcare services with experienced doctors and modern facilities.
          </p>

          <div className="about-icons">
            <div>👨‍⚕️ Qualified Doctors</div>
            <div>🚑 Emergency Services</div>
            <div>🧪 Accurate Testing</div>
            <div>🚐 Free Ambulance</div>
          </div>
        </div>

      </div>

      {/* SERVICES */}
      <div className="services-section text-center mt-5">

        <h6 className="text-primary">SERVICES</h6>
        <h1>Excellent Medical Services</h1>

        <div className="container services-grid mt-4">

          <div className="service-card">
            <h5>Emergency Care</h5>
            <p>Quick and reliable emergency services</p>
          </div>

          <div className="service-card">
            <h5>Operation & Surgery</h5>
            <p>Advanced surgical procedures</p>
          </div>

          <div className="service-card">
            <h5>Outdoor Checkup</h5>
            <p>Routine health checkups</p>
          </div>

          <div className="service-card">
            <h5>Ambulance Service</h5>
            <p>24/7 ambulance availability</p>
          </div>

          <div className="service-card">
            <h5>Medicine & Pharmacy</h5>
            <p>All medicines available</p>
          </div>

          <div className="service-card">
            <h5>Blood Testing</h5>
            <p>Accurate diagnostic tests</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;