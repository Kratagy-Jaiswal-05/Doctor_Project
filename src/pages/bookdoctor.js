import { useEffect, useMemo, useState } from "react";
import fallbackDoctors from "../data/doctors";
import { createAppointment } from "../services/appointmentsService";
import { fetchDoctors } from "../services/doctorsService";

function BookDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const isLoggedIn = localStorage.getItem("loggedIn");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let mounted = true;
    fetchDoctors()
      .then((list) => {
        if (mounted && Array.isArray(list) && list.length) setDoctors(list);
      })
      .catch(() => {
        if (mounted) setDoctors(fallbackDoctors);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const cities = useMemo(() => [...new Set(doctors.map((doc) => doc.city))], [doctors]);
  const categories = useMemo(
    () => [...new Set(doctors.map((doc) => doc.category))],
    [doctors]
  );

  const filteredDoctors = doctors.filter(
    (doc) => doc.city === city && doc.category === category
  );

  const generateSlots = (doctorData) => {
    if (!doctorData) return [];

    const [start, end] = doctorData.timing.split(" - ");
    const slotDuration = doctorData.slotDuration;

    const convert = (t) => {
      let [time, mod] = t.split(" ");
      let [h, m] = time.includes(":") ? time.split(":") : [time, "00"];

      h = parseInt(h);

      if (mod === "PM" && h !== 12) h += 12;
      if (mod === "AM" && h === 12) h = 0;

      return `${h.toString().padStart(2, "0")}:${m}`;
    };

    let startTime = convert(start);
    let endTime = convert(end);

    let slots = [];
    let current = new Date(`2020-01-01T${startTime}`);

    while (current < new Date(`2020-01-01T${endTime}`)) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + slotDuration);
    }

    return slots;
  };

  const getBookedSlots = () => {
    const existing = JSON.parse(localStorage.getItem("appointments")) || [];

    return existing
      .filter(
        (appt) =>
          appt.doctor === selectedDoctor &&
          appt.date === date
      )
      .map((appt) => appt.time);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();

    const diffDays = (selectedDate - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 0 || diffDays > 7) {
      alert("Booking allowed only within next 7 days");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("appointments")) || [];

    const alreadyBooked = existing.find(
      (appt) =>
        appt.doctor === selectedDoctor &&
        appt.date === date &&
        appt.time === time
    );

    if (alreadyBooked) {
      alert("This slot is already booked");
      return;
    }

    const selectedDoc = filteredDoctors.find((d) => d.name === selectedDoctor);

    try {
      const created = await createAppointment({
        doctor: selectedDoctor,
        doctorId: selectedDoc?.id,
        city,
        category,
        date,
        time,
        userEmail: user?.email || "guest@example.com",
        userName: user?.name || "Guest",
      });

      const newAppointment = {
        ...created,
      };

      existing.push(newAppointment);
      localStorage.setItem("appointments", JSON.stringify(existing));
      alert("Appointment Booked Successfully");
    } catch (err) {
      // Fallback to local-only behavior if API is down
      const newAppointment = {
        id: `local-${Date.now()}`,
        doctor: selectedDoctor,
        city,
        category,
        date,
        time,
        status: "pending",
      };
      existing.push(newAppointment);
      localStorage.setItem("appointments", JSON.stringify(existing));
      alert("Appointment Booked (offline mode)");
    }
  };

  return (
    <div className="main-bg d-flex justify-content-center align-items-center">
      <div className="card premium-card p-4 shadow-lg">

        <h2 className="text-center text-primary mb-4">
          Book Appointment
        </h2>

        <form onSubmit={handleBooking}>

          <select className="form-control mb-3" onChange={(e) => setCity(e.target.value)}>
            <option>Select City</option>
            {cities.map((c, i) => <option key={i}>{c}</option>)}
          </select>

          <select className="form-control mb-3" onChange={(e) => setCategory(e.target.value)}>
            <option>Select Category</option>
            {categories.map((c, i) => <option key={i}>{c}</option>)}
          </select>

          <select
            className="form-control mb-3"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option>Select Doctor</option>
            {filteredDoctors.map((doc, i) => (
              <option key={i}>{doc.name}</option>
            ))}
          </select>

          {selectedDoctor && (
            <div className="doctor-card">
              {filteredDoctors
                .filter((doc) => doc.name === selectedDoctor)
                .map((doc, i) => (
                  <div key={i}>
                    <div className="d-flex justify-content-between">
                      <h5>{doc.name}</h5>
                      <span className="rating-badge">⭐ {doc.rating}</span>
                    </div>

                    <p>👨‍⚕️ {doc.experience}</p>
                    <p>🎂 Age: {doc.age}</p>
                    <p>💰 ₹{doc.fees}</p>
                    <p>🏥 {doc.place}</p>
                    <p>📞 {doc.hospitalContact}</p>
                    <p>⏰ {doc.timing}</p>
                  </div>
                ))}
            </div>
          )}

          <input
            type="date"
            className="form-control mt-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="form-control mt-3"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option>Select Slot</option>

            {generateSlots(
              filteredDoctors.find(doc => doc.name === selectedDoctor)
            ).map((slot, i) => {

              const bookedSlots = getBookedSlots();
              const isBooked = bookedSlots.includes(slot);

              return (
                <option
                  key={i}
                  value={slot}
                  disabled={isBooked}
                >
                  {slot} {isBooked ? "(Booked)" : ""}
                </option>
              );
            })}
          </select>

          <button className="btn btn-primary w-100 mt-3">
            Book Appointment
          </button>

        </form>
      </div>
    </div>
  );
}

export default BookDoctor;