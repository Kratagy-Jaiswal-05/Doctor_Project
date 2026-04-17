import { useEffect, useState } from "react";
import { adminFetchSummary } from "../../services/adminService";
import { getAdminToken } from "../auth";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetchSummary(getAdminToken())
      .then(setSummary)
      .catch((e) => setError(e?.message || "Failed to load summary"));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  const byStatus = summary?.appointmentsByStatus || {};

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Dashboard</h3>
        <div className="text-muted small">Overview of system data</div>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card stat-card shadow-sm p-3">
            <div className="text-muted">Total Doctors</div>
            <div className="display-6">{summary ? summary.doctorsTotal : "—"}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card shadow-sm p-3">
            <div className="text-muted">Total Appointments</div>
            <div className="display-6">
              {summary ? summary.appointmentsTotal : "—"}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card shadow-sm p-3">
            <div className="text-muted">Pending</div>
            <div className="display-6">{summary ? byStatus.pending : "—"}</div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-md-4">
          <div className="card stat-card shadow-sm p-3">
            <div className="text-muted">Confirmed</div>
            <div className="h2 mb-0">{summary ? byStatus.confirmed : "—"}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card shadow-sm p-3">
            <div className="text-muted">Cancelled</div>
            <div className="h2 mb-0">{summary ? byStatus.cancelled : "—"}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card shadow-sm p-3">
            <div className="text-muted">Completed</div>
            <div className="h2 mb-0">{summary ? byStatus.completed : "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

