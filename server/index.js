const path = require("path");
const express = require("express");
const cors = require("cors");

const { readJson, writeJsonAtomic, ensureDir } = require("./storage");
const { generateSeedDoctors } = require("./seedDoctors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const DATA_DIR = path.join(__dirname, "data");
const DOCTORS_PATH = path.join(DATA_DIR, "doctors.json");
const APPOINTMENTS_PATH = path.join(DATA_DIR, "appointments.json");

ensureDir(DATA_DIR);

function nowIso() {
  return new Date().toISOString();
}

function loadDoctors() {
  let doctors = readJson(DOCTORS_PATH, null);
  if (!Array.isArray(doctors) || doctors.length === 0) {
    doctors = generateSeedDoctors();
    writeJsonAtomic(DOCTORS_PATH, doctors);
  }
  return doctors;
}

function saveDoctors(doctors) {
  writeJsonAtomic(DOCTORS_PATH, doctors);
}

function loadAppointments() {
  const appts = readJson(APPOINTMENTS_PATH, []);
  return Array.isArray(appts) ? appts : [];
}

function saveAppointments(appts) {
  writeJsonAtomic(APPOINTMENTS_PATH, appts);
}

function nextId(items) {
  const max = items.reduce((m, it) => Math.max(m, Number(it.id || 0)), 0);
  return String(max + 1);
}

function getAdminConfig() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
    token: process.env.ADMIN_TOKEN || "dev-admin-token",
  };
}

function requireAdmin(req, res, next) {
  const token = req.header("x-admin-token");
  if (!token || token !== getAdminConfig().token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: nowIso() });
});

// Admin auth
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const cfg = getAdminConfig();
  if (username === cfg.username && password === cfg.password) {
    return res.json({ token: cfg.token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

app.get("/api/admin/summary", requireAdmin, (req, res) => {
  const doctors = loadDoctors();
  const appts = loadAppointments();
  const summary = {
    doctorsTotal: doctors.length,
    appointmentsTotal: appts.length,
    appointmentsByStatus: appts.reduce(
      (acc, a) => {
        const s = (a.status || "pending").toLowerCase();
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, cancelled: 0, completed: 0 }
    ),
  };
  res.json(summary);
});

// Doctors (public read)
app.get("/api/doctors", (req, res) => {
  const doctors = loadDoctors();
  res.json(doctors);
});

// Doctors (admin CRUD)
app.post("/api/doctors", requireAdmin, (req, res) => {
  const doctors = loadDoctors();
  const payload = req.body || {};
  const id = nextId(doctors);
  const doctor = {
    id,
    name: payload.name || "",
    city: payload.city || "",
    category: payload.category || "",
    rating: Number(payload.rating || 0),
    experience: payload.experience || "",
    age: Number(payload.age || 0),
    fees: Number(payload.fees || 0),
    timing: payload.timing || "",
    place: payload.place || "",
    hospitalContact: payload.hospitalContact || "",
    slotDuration: Number(payload.slotDuration || 15),
  };
  doctors.push(doctor);
  saveDoctors(doctors);
  res.status(201).json(doctor);
});

app.put("/api/doctors/:id", requireAdmin, (req, res) => {
  const doctors = loadDoctors();
  const id = String(req.params.id);
  const idx = doctors.findIndex((d) => String(d.id) === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  doctors[idx] = { ...doctors[idx], ...(req.body || {}), id };
  saveDoctors(doctors);
  res.json(doctors[idx]);
});

app.delete("/api/doctors/:id", requireAdmin, (req, res) => {
  const doctors = loadDoctors();
  const id = String(req.params.id);
  const next = doctors.filter((d) => String(d.id) !== id);
  if (next.length === doctors.length) return res.status(404).json({ error: "Not found" });
  saveDoctors(next);
  res.json({ ok: true });
});

// Appointments
app.get("/api/appointments/me", (req, res) => {
  const email = String(req.query.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "email is required" });
  const appts = loadAppointments().filter(
    (a) => String(a.userEmail || "").toLowerCase() === email
  );
  res.json(appts);
});

app.post("/api/appointments", (req, res) => {
  const payload = req.body || {};
  const required = ["doctor", "city", "category", "date", "time", "userEmail"];
  const missing = required.filter((k) => !payload[k]);
  if (missing.length) {
    return res.status(400).json({ error: `Missing: ${missing.join(", ")}` });
  }

  const appts = loadAppointments();
  const clash = appts.find(
    (a) =>
      a.doctor === payload.doctor &&
      a.date === payload.date &&
      a.time === payload.time
  );
  if (clash) return res.status(409).json({ error: "Slot already booked" });

  const id = nextId(appts);
  const appt = {
    id,
    doctor: payload.doctor,
    doctorId: payload.doctorId ? String(payload.doctorId) : undefined,
    city: payload.city,
    category: payload.category,
    date: payload.date,
    time: payload.time,
    status: payload.status || "pending",
    userEmail: String(payload.userEmail).toLowerCase(),
    userName: payload.userName || "",
    createdAt: nowIso(),
  };

  appts.push(appt);
  saveAppointments(appts);
  res.status(201).json(appt);
});

app.get("/api/appointments", requireAdmin, (req, res) => {
  const appts = loadAppointments();
  res.json(appts);
});

app.patch("/api/appointments/:id/status", requireAdmin, (req, res) => {
  const appts = loadAppointments();
  const id = String(req.params.id);
  const idx = appts.findIndex((a) => String(a.id) === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const status = String((req.body || {}).status || "").toLowerCase();
  const allowed = new Set(["pending", "confirmed", "cancelled", "completed"]);
  if (!allowed.has(status)) return res.status(400).json({ error: "Invalid status" });
  appts[idx] = { ...appts[idx], status };
  saveAppointments(appts);
  res.json(appts[idx]);
});

app.delete("/api/appointments/:id", (req, res) => {
  const appts = loadAppointments();
  const id = String(req.params.id);
  const idx = appts.findIndex((a) => String(a.id) === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const isAdmin = req.header("x-admin-token") === getAdminConfig().token;
  if (!isAdmin) {
    const email = String((req.body || {}).userEmail || "").toLowerCase();
    if (!email) return res.status(401).json({ error: "Unauthorized" });
    if (String(appts[idx].userEmail || "").toLowerCase() !== email) {
      return res.status(403).json({ error: "Forbidden" });
    }
    // user-side cancellation becomes cancelled instead of delete
    appts[idx] = { ...appts[idx], status: "cancelled" };
    saveAppointments(appts);
    return res.json(appts[idx]);
  }

  const next = appts.filter((a) => String(a.id) !== id);
  saveAppointments(next);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});

