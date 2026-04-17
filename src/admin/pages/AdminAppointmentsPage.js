import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminDeleteAppointment,
  adminFetchAppointments,
  adminUpdateAppointmentStatus,
} from "../../services/appointmentsService";
import { getAdminToken } from "../auth";

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"];

export default function AdminAppointmentsPage() {
  const token = getAdminToken();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await adminFetchAppointments(token);
      setAppointments(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return appointments;
    return appointments.filter(
      (a) => String(a.status || "").toLowerCase() === statusFilter
    );
  }, [appointments, statusFilter]);

  const updateStatus = async (id, status) => {
    setError("");
    try {
      const updated = await adminUpdateAppointmentStatus(id, status, token);
      setAppointments((prev) => prev.map((a) => (String(a.id) === String(id) ? updated : a)));
    } catch (e) {
      setError(e?.message || "Failed to update status");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    setError("");
    try {
      await adminDeleteAppointment(id, token);
      setAppointments((prev) => prev.filter((a) => String(a.id) !== String(id)));
    } catch (e) {
      setError(e?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Appointments</h3>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="btn btn-outline-secondary" onClick={load} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Doctor</th>
                <th>City</th>
                <th>Category</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    <div className="fw-semibold">{a.userName || "—"}</div>
                    <div className="text-muted small">{a.userEmail || "—"}</div>
                  </td>
                  <td className="fw-semibold">{a.doctor}</td>
                  <td>{a.city}</td>
                  <td>{a.category}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td style={{ minWidth: 140 }}>
                    <select
                      className="form-select form-select-sm"
                      value={String(a.status || "pending").toLowerCase()}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(a.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

