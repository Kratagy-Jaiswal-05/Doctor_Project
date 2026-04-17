function generateSeedDoctors() {
  const doctors = [];

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Ahmedabad",
  ];

  const categories = [
    "Physician",
    "Dentist",
    "Cardiologist",
    "Dermatologist",
    "Orthopedic",
    "Neurologist",
    "Pediatrician",
    "Gynecologist",
  ];

  const firstNames = [
    "Raj",
    "Amit",
    "Neha",
    "Rohit",
    "Imran",
    "Suresh",
    "Priya",
    "Riya",
    "Ankit",
    "Nikhil",
    "Arjun",
    "Kavya",
    "Pooja",
    "Rahul",
    "Sneha",
    "Vikas",
    "Ananya",
    "Aditya",
    "Kiran",
    "Meera",
    "Vivek",
    "Simran",
    "Deepak",
    "Ritu",
  ];

  const lastNames = [
    "Sharma",
    "Verma",
    "Gupta",
    "Mehta",
    "Khan",
    "Reddy",
    "Nair",
    "Kapoor",
    "Jain",
    "Patil",
    "Singh",
    "Agarwal",
    "Bansal",
    "Yadav",
    "Joshi",
    "Mishra",
    "Sen",
    "Kulkarni",
    "Rao",
    "Iyer",
    "Tiwari",
    "Kaur",
    "Chauhan",
    "Malhotra",
  ];

  const hospitals = [
    "CityCare Hospital",
    "Apollo Clinic",
    "Fortis Health",
    "Medanta Center",
    "Care Hospital",
    "Sunrise Clinic",
    "LifeCare Hospital",
    "HealthPlus Clinic",
  ];

  let id = 1;

  cities.forEach((city) => {
    categories.forEach((category) => {
      for (let i = 0; i < 4; i++) {
        const first = firstNames[(id + i) % firstNames.length];
        const last = lastNames[(id + i * 3) % lastNames.length];

        const rating = Number((3.8 + Math.random() * 1.2).toFixed(1));
        const experience = Math.floor(Math.random() * 12) + 4;
        const age = experience + 26;
        const fees = Math.floor(Math.random() * 600) + 400;

        const startHour = 9 + (i % 4);
        const endHour = startHour + 4;

        const start = `${startHour} ${startHour >= 12 ? "PM" : "AM"}`;
        const end = `${endHour > 12 ? endHour - 12 : endHour} ${
          endHour >= 12 ? "PM" : "AM"
        }`;

        doctors.push({
          id: String(id),
          city,
          category,
          name: `Dr. ${first} ${last}`,
          rating,
          experience: `${experience} years`,
          age,
          fees,
          timing: `${start} - ${end}`,
          place: `${hospitals[(id + i) % hospitals.length]} ${city}`,
          hospitalContact: `+91-98${100000 + id}`,
          slotDuration: i % 2 === 0 ? 15 : 20,
        });

        id++;
      }
    });
  });

  return doctors;
}

module.exports = { generateSeedDoctors };

