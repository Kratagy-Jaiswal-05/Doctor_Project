import { useState } from "react";

function BookDoctor() {
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();
    alert("Appointment Booked Successfully");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }} className="d-flex justify-content-center align-items-center">

      <div className="card p-4 shadow-lg" style={{ width: "420px", borderRadius: "15px" }}>
        
        <h2 className="text-center text-primary mb-4">Book Appointment</h2>

        <form onSubmit={handleBooking}>

          <div className="mb-3">
            <label className="form-label">Doctor Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter doctor name"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100">
            Confirm Booking
          </button>

        </form>

      </div>

    </div>
  );
}

export default BookDoctor;