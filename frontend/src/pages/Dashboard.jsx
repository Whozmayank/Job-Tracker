import { useEffect, useState } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../api/application";
import "./Dashboard.css";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // create form
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("applied");
  const [notes, setNotes] = useState("");
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // edit
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("applied");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getApplications();
      setApplications(Array.isArray(res.data) ? res.data : res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!company || !role) return alert("Company and role required");

    try {
      const res = await createApplication({
        company,
        role,
        status,
        notes,
        appliedDate,
      });

      const newApp = res.data.data || res.data;
      setApplications((prev) => [...prev, newApp]);

      setCompany("");
      setRole("");
      setStatus("applied");
      setNotes("");
      setAppliedDate(new Date().toISOString().slice(0, 10));
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateApplication(id, {
        status: editStatus,
        notes: editNotes,
      });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, status: editStatus, notes: editNotes }
            : app
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const summary = {
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    offer: applications.filter((a) => a.status === "offer").length,
  };

  const filtered =
    filterStatus === "all"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <h1 className="dashboard-title">My Applications</h1>

        {/* SUMMARY */}
        <div className="summary-grid">
          {["applied", "interview", "offer", "rejected"].map((key) => (
            <div
              key={key}
              className={`summary-card ${
                filterStatus === key ? "active" : ""
              }`}
              onClick={() => setFilterStatus(key)}
            >
              <span>{key.toUpperCase()}</span>
              <strong>{summary[key]}</strong>
            </div>
          ))}
        </div>

        <div className="dashboard-actions">
          <button
            className="btn primary"
            onClick={() => setShowForm((p) => !p)}
          >
            {showForm ? "Cancel" : "+ Add Job"}
          </button>

          <button
            className="btn ghost"
            onClick={() => setFilterStatus("all")}
          >
            Show All
          </button>
        </div>

        {/* CREATE FORM */}
        {showForm && (
          <form className="create-form" onSubmit={handleCreate}>
            <input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="date"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
            />
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button className="btn primary">Save</button>
          </form>
        )}

        {/* LIST */}
        {loading && <p className="info">Loading…</p>}

        {!loading && filtered.length === 0 && (
          <p className="info">No applications found.</p>
        )}


<div className="jobs-grid">
  {filtered.map((app) => (
    <div className="job-card" key={app._id}>
      <strong>{app.company}</strong>
      <p>{app.role}</p>

      {editingId === app._id ? (
        <>
          {/* EDIT MODE */}
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>

          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
          />

          <div className="actions">
            <button
              className="btn primary"
              onClick={() => handleUpdate(app._id)}
            >
              Save
            </button>

            <button
              className="btn ghost"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {/* VIEW MODE */}
          <p>Status: {app.status}</p>

          {app.appliedDate && (
            <p>
              Applied: {new Date(app.appliedDate).toLocaleDateString()}
            </p>
          )}

          {app.notes && <p>{app.notes}</p>}

          <div className="actions">
            <button
              className="btn ghost"
              onClick={() => {
                setEditingId(app._id);
                setEditStatus(app.status);
                setEditNotes(app.notes || "");
              }}
            >
              Edit
            </button>

            <button
              className="btn danger"
              onClick={() => handleDelete(app._id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default Dashboard;
