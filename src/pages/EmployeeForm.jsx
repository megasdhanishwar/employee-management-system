import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageHeader } from "../components/UI";
const blank = {
  name: "",
  email: "",
  phone: "",
  department: "",
  role: "",
  status: "Active",
  type: "Full-time",
  joined: new Date().toISOString().slice(0, 10),
  location: "",
  salary: "",
};
export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, departments, addEmployee, updateEmployee } = useApp();
  const existing = employees.find((e) => e.id === id);
  const [form, setForm] = useState(() => (existing ? { ...existing } : blank));
  const [errors, setErrors] = useState({});
  const edit = Boolean(id);
  if (edit && !existing)
    return (
      <div className="panel pad">
        <h2>Employee not found</h2>
        <Link to="/employees">Back to employees</Link>
      </div>
    );
  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };
  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      err.name = "Enter a valid name (at least 2 characters)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter a valid email";
    if (
      employees.some(
        (e) =>
          e.email.toLowerCase() === form.email.toLowerCase() && e.id !== id,
      )
    )
      err.email = "Email already exists";
    if (!/^\+?[\d\s()-]{8,18}$/.test(form.phone.trim()))
      err.phone = "Enter a valid phone number";
    if (!form.department) err.department = "Select a department";
    if (!form.role.trim()) err.role = "Designation is required";
    if (!form.joined) err.joined = "Select a joining date";
    if (!form.location.trim()) err.location = "Location is required";
    if (
      form.salary !== "" &&
      (!Number.isFinite(Number(form.salary)) || Number(form.salary) < 0)
    )
      err.salary = "Salary must be non-negative";
    setErrors(err);
    if (Object.keys(err).length) return;
    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      salary: Number(form.salary) || 0,
    };
    if (edit) updateEmployee(id, payload);
    else addEmployee(payload);
    navigate("/employees");
  };
  return (
    <>
      <PageHeader
        title={edit ? "Edit Employee" : "Add New Employee"}
        subtitle={
          edit
            ? "Update employee information."
            : "Fill in the details to create a new employee record."
        }
        action={
          <Link to="/employees" className="btn btn-ghost">
            <ArrowLeft size={17} /> Back to Employees
          </Link>
        }
      />
      <form onSubmit={submit} noValidate className="panel employee-form">
        <div className="form-section-title">
          <h2>Personal Information</h2>
          <p>Basic details about the employee</p>
        </div>
        <div className="form-grid">
          {[
            ["name", "Full Name", "text", "e.g. Aarav Sharma"],
            ["email", "Email Address", "email", "name@company.com"],
            ["phone", "Phone Number", "tel", "+91 98765 43210"],
            ["location", "Work Location", "text", "e.g. Chennai"],
          ].map(([name, label, type, placeholder]) => (
            <label className="field" key={name}>
              <span>{label} *</span>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={change}
                placeholder={placeholder}
              />
              {errors[name] && (
                <small className="field-error">{errors[name]}</small>
              )}
            </label>
          ))}
        </div>
        <div className="form-section-title second">
          <h2>Employment Details</h2>
          <p>Work-related information and status</p>
        </div>
        <div className="form-grid">
          <label className="field">
            <span>Department *</span>
            <select name="department" value={form.department} onChange={change}>
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.id}>{d.name}</option>
              ))}
            </select>
            {errors.department && (
              <small className="field-error">{errors.department}</small>
            )}
          </label>
          <label className="field">
            <span>Designation *</span>
            <input
              name="role"
              value={form.role}
              onChange={change}
              placeholder="e.g. Software Engineer"
            />
            {errors.role && (
              <small className="field-error">{errors.role}</small>
            )}
          </label>
          <label className="field">
            <span>Employment Status</span>
            <select name="status" value={form.status} onChange={change}>
              {["Active", "Inactive", "On Leave"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Employment Type</span>
            <select name="type" value={form.type} onChange={change}>
              {["Full-time", "Part-time", "Contract", "Intern"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Joining Date *</span>
            <input
              type="date"
              name="joined"
              value={form.joined}
              onChange={change}
            />
            {errors.joined && (
              <small className="field-error">{errors.joined}</small>
            )}
          </label>
          <label className="field">
            <span>Annual Salary (₹)</span>
            <input
              type="number"
              min="0"
              name="salary"
              value={form.salary}
              onChange={change}
              placeholder="e.g. 600000"
            />
            {errors.salary && (
              <small className="field-error">{errors.salary}</small>
            )}
          </label>
        </div>
        <div className="form-actions">
          <Link to="/employees" className="btn btn-ghost">
            Cancel
          </Link>
          <button className="btn btn-primary" type="submit">
            <Save size={17} />
            {edit ? "Save Changes" : "Create Employee"}
          </button>
        </div>
      </form>
    </>
  );
}
