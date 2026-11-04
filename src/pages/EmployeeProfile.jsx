import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Avatar, Badge, PageHeader } from "../components/UI";
import { prettyDate, money } from "../utils/helpers";
export default function EmployeeProfile() {
  const { id } = useParams();
  const { employees, attendance, leaves, ask, deleteEmployee } = useApp();
  const e = employees.find((v) => v.id === id);
  const a = attendance.find((v) => v.employeeId === id);
  if (!e)
    return (
      <div className="panel pad">
        <h2>Employee not found</h2>
        <Link to="/employees">Back to directory</Link>
      </div>
    );
  return (
    <>
      <PageHeader
        title="Employee Profile"
        subtitle="View employee details and employment information."
        action={
          <Link className="btn btn-ghost" to="/employees">
            <ArrowLeft size={17} /> Back
          </Link>
        }
      />
      <div className="profile-cover panel">
        <div className="profile-banner" />
        <div className="profile-identity">
          <Avatar name={e.name} size={82} />
          <div>
            <h2>{e.name}</h2>
            <p>
              {e.role} · {e.department}
            </p>
            <Badge value={e.status} />
          </div>
          <div className="profile-buttons">
            <Link className="btn btn-primary" to={`/employees/${id}/edit`}>
              <Pencil size={16} /> Edit Profile
            </Link>
            <button
              className="btn btn-outline-danger"
              onClick={() =>
                ask(`Permanently delete ${e.name}?`, () => deleteEmployee(id))
              }
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
      <div className="profile-grid">
        <section className="panel pad">
          <h2>Personal Information</h2>
          <div className="detail-list">
            <div>
              <Mail size={18} />
              <span>
                Email Address<strong>{e.email}</strong>
              </span>
            </div>
            <div>
              <Phone size={18} />
              <span>
                Phone Number<strong>{e.phone}</strong>
              </span>
            </div>
            <div>
              <MapPin size={18} />
              <span>
                Work Location<strong>{e.location}</strong>
              </span>
            </div>
            <div>
              <Calendar size={18} />
              <span>
                Joining Date<strong>{prettyDate(e.joined)}</strong>
              </span>
            </div>
          </div>
        </section>
        <section className="panel pad">
          <h2>Employment Information</h2>
          <div className="detail-list">
            <div>
              <Briefcase size={18} />
              <span>
                Employee ID<strong>{e.id}</strong>
              </span>
            </div>
            <div>
              <Briefcase size={18} />
              <span>
                Department<strong>{e.department}</strong>
              </span>
            </div>
            <div>
              <Briefcase size={18} />
              <span>
                Employment Type<strong>{e.type}</strong>
              </span>
            </div>
            <div>
              <Briefcase size={18} />
              <span>
                Annual Salary<strong>{money(e.salary)}</strong>
              </span>
            </div>
          </div>
        </section>
      </div>
      <div className="profile-grid">
        <section className="panel pad">
          <h2>Attendance Snapshot</h2>
          <div className="mini-stats">
            <div>
              <strong>{a?.present ?? 0}</strong>
              <span>Present</span>
            </div>
            <div>
              <strong>{a?.absent ?? 0}</strong>
              <span>Absent</span>
            </div>
            <div>
              <strong>{a?.late ?? 0}</strong>
              <span>Late</span>
            </div>
          </div>
        </section>
        <section className="panel pad">
          <h2>Leave History</h2>
          {leaves.filter((l) => l.employeeId === id).length ? (
            leaves
              .filter((l) => l.employeeId === id)
              .map((l) => (
                <div className="leave-mini" key={l.id}>
                  <span>
                    {l.type}
                    <small>
                      {prettyDate(l.from)} – {prettyDate(l.to)}
                    </small>
                  </span>
                  <Badge value={l.status} />
                </div>
              ))
          ) : (
            <p className="muted">No leave requests for this employee.</p>
          )}
        </section>
      </div>
    </>
  );
}
