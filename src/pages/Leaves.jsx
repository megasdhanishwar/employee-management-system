import React, { useState } from "react";
import { CalendarDays, Check, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Avatar, Badge, Empty, PageHeader } from "../components/UI";
import { prettyDate } from "../utils/helpers";
export default function Leaves() {
  const { leaves, employees, updateLeave, ask } = useApp();
  const [filter, setFilter] = useState("All");
  const list = leaves.filter((l) => filter === "All" || l.status === filter);
  return (
    <>
      <PageHeader
        title="Leave Requests"
        subtitle="Review, approve, and manage employee leave applications."
      />
      <div className="leave-summary">
        {["Pending", "Approved", "Rejected"].map((s) => (
          <div className="panel leave-stat" key={s}>
            <CalendarDays size={21} />
            <span>{s} Requests</span>
            <strong>{leaves.filter((l) => l.status === s).length}</strong>
          </div>
        ))}
      </div>
      <section className="panel">
        <div className="table-toolbar">
          <h2>All Leave Requests</h2>
          <select
            aria-label="Filter leave status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["All", "Pending", "Approved", "Rejected"].map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>
        {list.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((l, i) => {
                  const e = employees.find((v) => v.id === l.employeeId);
                  return (
                    <tr key={l.id}>
                      <td>
                        <div className="person-cell">
                          <Avatar name={e?.name || "Unknown"} index={i} />
                          <span>
                            <strong>{e?.name || "Unknown employee"}</strong>
                            <small>{l.id}</small>
                          </span>
                        </div>
                      </td>
                      <td>{l.type}</td>
                      <td>{prettyDate(l.from)}</td>
                      <td>{prettyDate(l.to)}</td>
                      <td className="reason-cell" title={l.reason}>
                        {l.reason}
                      </td>
                      <td>
                        <Badge value={l.status} />
                      </td>
                      <td>
                        {l.status === "Pending" ? (
                          <div className="row-actions">
                            <button
                              className="approve"
                              title="Approve"
                              aria-label="Approve leave"
                              onClick={() =>
                                ask("Approve this leave request?", () =>
                                  updateLeave(l.id, "Approved"),
                                )
                              }
                            >
                              <Check size={18} />
                            </button>
                            <button
                              className="reject"
                              title="Reject"
                              aria-label="Reject leave"
                              onClick={() =>
                                ask("Reject this leave request?", () =>
                                  updateLeave(l.id, "Rejected"),
                                )
                              }
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="muted">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            message="No leave requests"
            hint="No requests match the selected status."
          />
        )}
      </section>
    </>
  );
}
