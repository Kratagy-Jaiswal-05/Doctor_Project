import { useEffect, useState } from "react";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(data);
  }, []);

  const handleCancel = (index) => {
    const updated = appointments.filter((_, i) => i !== index);
    localStorage.setItem("appointments", JSON.stringify(updated));
    setAppointments(updated);
  };

  return (
    <div className="main-bg p-5">
      <h2 className="text-center text-primary mb-4">
        My Appointments
      </h2>

      <div className="container">

        {appointments.length === 0 ? (
          <p className="text-center">No appointments booked</p>
        ) : (
          appointments.map((appt, index) => (
            <div key={index} className="appointment-card mb-3 p-3">

              <h5>{appt.doctor}</h5>

              <p>📍 {appt.city}</p>
              <p>🩺 {appt.category}</p>
              <p>📅 {appt.date}</p>
              <p>⏰ {appt.time}</p>

              <button
                className="btn btn-danger mt-2"
                onClick={() => handleCancel(index)}
              >
                Cancel Appointment
              </button>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Appointments;