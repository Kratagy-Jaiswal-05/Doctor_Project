import { useEffect, useState } from "react";
import { cancelMyAppointment, fetchMyAppointments } from "../services/appointmentsService";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(local);

    const isLoggedIn = localStorage.getItem("loggedIn");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!isLoggedIn || !user?.email) return;

    fetchMyAppointments(user.email)
      .then((remote) => {
        if (Array.isArray(remote)) {
          setAppointments(remote);
          localStorage.setItem("appointments", JSON.stringify(remote));
        }
      })
      .catch(() => {
        // keep local fallback
      });
  }, []);

  const handleCancel = async (index) => {
    const appt = appointments[index];

    const user = JSON.parse(localStorage.getItem("user"));
    if (appt?.id && !String(appt.id).startsWith("local-") && user?.email) {
      try {
        const updatedAppt = await cancelMyAppointment(appt.id, user.email);
        const updated = appointments.map((a, i) => (i === index ? updatedAppt : a));
        localStorage.setItem("appointments", JSON.stringify(updated));
        setAppointments(updated);
        return;
      } catch {
        // fallthrough to local removal
      }
    }

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
              {appt.status && <p>📌 Status: {appt.status}</p>}

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