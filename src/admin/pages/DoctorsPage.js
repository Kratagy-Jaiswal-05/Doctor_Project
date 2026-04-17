import { useEffect, useMemo, useState } from "react";
import {
  adminCreateDoctor,
  adminDeleteDoctor,
  adminUpdateDoctor,
  fetchDoctors,
} from "../../services/doctorsService";
import { getAdminToken } from "../auth";

const emptyForm = {
  name: "",
  city: "",
  category: "",
  rating: 4.5,
  experience: "5 years",
  age: 35,
  fees: 500,
  timing: "9 AM - 1 PM",
  place: "",
  hospitalContact: "",
  slotDuration: 15,
};

export default function DoctorsPage() {
  const token = getAdminToken();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchDoctors();
      setDoctors(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const isEditing = Boolean(editingId);
  const editingDoctor = useMemo(
    () => doctors.find((d) => String(d.id) === String(editingId)),
    [doctors, editingId]
  );

  const startEdit = (doc) => {
    setEditingId(String(doc.id));
    setForm({
      name: doc.name || "",
      city: doc.city || "",
      category: doc.category || "",
      rating: Number(doc.rating || 0),
      experience: doc.experience || "",
      age: Number(doc.age || 0),
      fees: Number(doc.fees || 0),
      timing: doc.timing || "",
      place: doc.place || "",
      hospitalContact: doc.hospitalContact || "",
      slotDuration: Number(doc.slotDuration || 15),
    });
  };

  const reset = () => {
    setEditingId("");
    setForm(emptyForm);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEditing) {
        await adminUpdateDoctor(editingId, form, token);
      } else {
        await adminCreateDoctor(form, token);
      }
      await load();
      reset();
    } catch (e2) {
      setError(e2?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    setError("");
    try {
      await adminDeleteDoctor(id, token);
      await load();
      if (String(editingId) === String(id)) reset();
    } catch (e) {
      setError(e?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Doctors</h3>
        <button className="btn btn-outline-secondary" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card shadow-sm p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="fw-semibold">{isEditing ? "Edit Doctor" : "Add Doctor"}</div>
              {isEditing && (
                <button className="btn btn-sm btn-outline-secondary" onClick={reset}>
                  Cancel
                </button>
              )}
            </div>
            {isEditing && editingDoctor && (
              <div className="text-muted small mb-2">Editing: {editingDoctor.name}</div>
            )}

            <form onSubmit={submit} className="mt-2">
              {[
                ["name", "Name"],
                ["city", "City"],
                ["category", "Category"],
                ["experience", "Experience"],
                ["timing", "Timing"],
                ["place", "Place / Hospital"],
                ["hospitalContact", "Hospital Contact"],
              ].map(([key, label]) => (
                <div className="mb-2" key={key}>
                  <label className="form-label small">{label}</label>
                  <input
                    className="form-control"
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    required={key === "name" || key === "city" || key === "category"}
                  />
                </div>
              ))}

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small">Fees</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.fees}
                    onChange={(e) => setForm((p) => ({ ...p, fees: Number(e.target.value) }))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={form.rating}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, rating: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="row g-2 mt-1">
                <div className="col-6">
                  <label className="form-label small">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.age}
                    onChange={(e) => setForm((p) => ({ ...p, age: Number(e.target.value) }))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Slot Duration (min)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.slotDuration}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, slotDuration: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <button className="btn btn-primary w-100 mt-3" disabled={loading}>
                {isEditing ? "Update Doctor" : "Add Doctor"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Category</th>
                    <th>Fees</th>
                    <th>Timing</th>
                    <th style={{ width: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d) => (
                    <tr key={d.id}>
                      <td className="fw-semibold">{d.name}</td>
                      <td>{d.city}</td>
                      <td>{d.category}</td>
                      <td>₹{d.fees}</td>
                      <td>{d.timing}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(d)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => remove(d.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && doctors.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        No doctors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

