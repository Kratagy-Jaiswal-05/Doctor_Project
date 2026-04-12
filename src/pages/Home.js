import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* HERO */}
      <div className="container-fluid bg-primary py-5 mb-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8 text-white">
              <h1 className="display-4 mb-4">
                Best Healthcare Solution In Your City
              </h1>

              <p className="mb-4">
                Book appointments with top doctors easily and quickly.
              </p>

              <Link to="/book">
                <button className="btn btn-light me-3">
                  Book Appointment
                </button>
              </Link>

              <Link to="/login">
                <button className="btn btn-outline-light">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-6">
            <img
              src="/img/about.jpg"
              alt="doctor"
              className="img-fluid rounded"
            />
          </div>

          <div className="col-lg-6">
            <h2 className="text-primary mb-3">About Us</h2>
            <h3>Best Medical Care For You</h3>

            <p>
              We provide the best healthcare services with experienced doctors
              and modern facilities.
            </p>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="container py-5">
        <h2 className="text-center text-primary mb-5">
          Our Services
        </h2>

        <div className="row">

          <div className="col-md-4">
            <div className="card text-center p-3">
              <h4>Emergency Care</h4>
              <p>24/7 emergency services available.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center p-3">
              <h4>Doctor Consultation</h4>
              <p>Consult top doctors easily.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-center p-3">
              <h4>Online Booking</h4>
              <p>Book appointments in seconds.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;