import React, { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Clock3, CalendarCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  Avatar,
  Empty,
  PageHeader,
  Pagination,
  SearchBox,
} from "../components/UI";
export default function Attendance() {
  const { employees, attendance } = useApp();
  const [query, setQuery] = useState(""),
    [page, setPage] = useState(1);
  const rows = useMemo(
    () =>
      attendance
        .map((a) => ({
          ...a,
          employee: employees.find((e) => e.id === a.employeeId),
        }))
        .filter(
          (a) =>
            a.employee &&
            (a.employee.name + " " + a.employee.department)
              .toLowerCase()
              .includes(query.toLowerCase()),
        ),
    [employees, attendance, query],
  );
  const total = (k) => rows.reduce((sum, a) => sum + a[k], 0);
  return (
    <>
      <PageHeader
        title="Attendance Summary"
        subtitle="Track team attendance and working-day statistics (demo data)."
      />
      <div className="stats-grid">
        {[
          ["Total Present", total("present"), CheckCircle2, "green"],
          ["Total Absent", total("absent"), XCircle, "orange"],
          ["Late Arrivals", total("late"), Clock3, "purple"],
          ["Employees Tracked", rows.length, CalendarCheck, "blue"],
        ].map(([label, n, Icon, color]) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}>
              <Icon size={22} />
            </div>
            <span>{label}</span>
            <div className="stat-value">{n}</div>
            <small>Current demo period</small>
          </div>
        ))}
      </div>
      <section className="panel">
        <div className="table-toolbar">
          <h2>Employee Attendance</h2>
          <SearchBox
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="Search by name or department"
          />
        </div>
        {rows.length ? (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Working Days</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice((page - 1) * 8, page * 8).map((a, i) => (
                    <tr key={a.employeeId}>
                      <td>
                        <div className="person-cell">
                          <Avatar name={a.employee.name} index={i} />
                          <span>
                            <strong>{a.employee.name}</strong>
                            <small>{a.employee.id}</small>
                          </span>
                        </div>
                      </td>
                      <td>{a.employee.department}</td>
                      <td>{a.workingDays}</td>
                      <td className="text-green">{a.present}</td>
                      <td className="text-red">{a.absent}</td>
                      <td>{a.late}</td>
                      <td>
                        <div className="rate">
                          <span>
                            {Math.round((a.present / a.workingDays) * 100)}%
                          </span>
                          <div>
                            <i
                              style={{
                                width: `${Math.min(100, (a.present / a.workingDays) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              setPage={setPage}
              total={rows.length}
              perPage={8}
            />
          </>
        ) : (
          <Empty />
        )}
      </section>
    </>
  );
}
