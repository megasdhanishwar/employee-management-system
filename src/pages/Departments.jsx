import React, { useState } from "react";
import { Building2, Plus, Pencil, Trash2, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Modal, PageHeader, Empty } from "../components/UI";
export default function Departments() {
  const {
    departments,
    employees,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    ask,
  } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", lead: "", description: "" });
  const [error, setError] = useState("");
  const open = (d = null) => {
    setEditing(d?.id || "new");
    setForm(
      d
        ? { name: d.name, lead: d.lead, description: d.description }
        : { name: "", lead: "", description: "" },
    );
    setError("");
  };
  const save = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Department name must be at least 2 characters");
      return;
    }
    if (
      departments.some(
        (d) =>
          d.name.toLowerCase() === form.name.trim().toLowerCase() &&
          d.id !== editing,
      )
    ) {
      setError("Department name already exists");
      return;
    }
    if (!form.lead.trim()) {
      setError("Enter department lead");
      return;
    }
    const data = {
      name: form.name.trim(),
      lead: form.lead.trim(),
      description: form.description.trim(),
    };
    if (editing === "new") addDepartment(data);
    else updateDepartment(editing, data);
    setEditing(null);
  };
  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="Organize and manage your company's departments."
        action={
          <button className="btn btn-primary" onClick={() => open()}>
            <Plus size={17} /> Add Department
          </button>
        }
      />
      {departments.length ? (
        <div className="department-grid">
          {departments.map((d, i) => (
            <article className="panel department-card" key={d.id}>
              <div className="dept-top">
                <div
                  className="dept-icon"
                  style={{
                    background: [
                      "#eef2ff",
                      "#ecfeff",
                      "#fff7ed",
                      "#fdf2f8",
                      "#f0fdf4",
                      "#eff6ff",
                    ][i % 6],
                  }}
                >
                  <Building2 size={22} />
                </div>
                <div className="row-actions">
                  <button
                    title="Edit department"
                    aria-label="Edit department"
                    onClick={() => open(d)}
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    title="Delete department"
                    aria-label="Delete department"
                    onClick={() =>
                      ask(
                        employees.some((e) => e.department === d.name)
                          ? "This department has employees. Reassign them before deleting."
                          : "Delete this department?",
                        () => {
                          if (!employees.some((e) => e.department === d.name))
                            deleteDepartment(d.id);
                        },
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
              <h2>{d.name}</h2>
              <p>{d.description || "No description provided"}</p>
              <div className="dept-footer">
                <span>
                  <Users size={17} />{" "}
                  {employees.filter((e) => e.department === d.name).length}{" "}
                  Employees
                </span>
                <span>Lead: {d.lead}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          message="No departments yet"
          hint="Create a department to get started."
        />
      )}
      {editing && (
        <Modal
          title={editing === "new" ? "Add Department" : "Edit Department"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="modal-form">
            <label className="field">
              <span>Department Name *</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Engineering"
              />
            </label>
            <label className="field">
              <span>Department Lead *</span>
              <input
                value={form.lead}
                onChange={(e) => setForm({ ...form, lead: e.target.value })}
                placeholder="e.g. Aarav Sharma"
              />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Department responsibilities"
              />
            </label>
            {error && <p className="field-error">{error}</p>}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save Department
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
