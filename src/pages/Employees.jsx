import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  Avatar,
  Badge,
  Empty,
  PageHeader,
  Pagination,
  SearchBox,
} from "../components/UI";
import { prettyDate } from "../utils/helpers";
export default function Employees() {
  const { employees, departments, ask, deleteEmployee } = useApp();
  const [query, setQuery] = useState(""),
    [dept, setDept] = useState(""),
    [status, setStatus] = useState(""),
    [sort, setSort] = useState("name"),
    [page, setPage] = useState(1);
  const filtered = useMemo(
    () =>
      employees
        .filter(
          (e) =>
            (e.name + " " + e.email + " " + e.role)
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            (!dept || e.department === dept) &&
            (!status || e.status === status),
        )
        .sort((a, b) =>
          sort === "newest"
            ? b.joined.localeCompare(a.joined)
            : sort === "oldest"
              ? a.joined.localeCompare(b.joined)
              : a.name.localeCompare(b.name),
        ),
    [employees, query, dept, status, sort],
  );
  const update = (fn) => (v) => {
    fn(v);
    setPage(1);
  };
  return (
    <>
      <PageHeader
        title="Employees"
        subtitle="Manage your team members and employee information."
        action={
          <Link to="/employees/new" className="btn btn-primary">
            <Plus size={17} /> Add Employee
          </Link>
        }
      />
      <section className="panel">
        <div className="table-toolbar">
          <SearchBox
            value={query}
            onChange={update(setQuery)}
            placeholder="Search employees..."
          />
          <select
            aria-label="Department filter"
            value={dept}
            onChange={(e) => update(setDept)(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id}>{d.name}</option>
            ))}
          </select>
          <select
            aria-label="Status filter"
            value={status}
            onChange={(e) => update(setStatus)(e.target.value)}
          >
            <option value="">All Statuses</option>
            {["Active", "Inactive", "On Leave"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            aria-label="Sort employees"
            value={sort}
            onChange={(e) => update(setSort)(e.target.value)}
          >
            <option value="name">Name A–Z</option>
            <option value="newest">Newest Joined</option>
            <option value="oldest">Oldest Joined</option>
          </select>
        </div>
        {filtered.length ? (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Joining Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice((page - 1) * 8, page * 8).map((e, i) => (
                    <tr key={e.id}>
                      <td>
                        <Link className="person-cell" to={`/employees/${e.id}`}>
                          <Avatar name={e.name} index={i} />
                          <span>
                            <strong>{e.name}</strong>
                            <small>{e.email}</small>
                          </span>
                        </Link>
                      </td>
                      <td>{e.id}</td>
                      <td>{e.department}</td>
                      <td>{e.role}</td>
                      <td>{prettyDate(e.joined)}</td>
                      <td>
                        <Badge value={e.status} />
                      </td>
                      <td>
                        <div className="row-actions">
                          <Link
                            aria-label="View employee"
                            title="View"
                            to={`/employees/${e.id}`}
                          >
                            <Eye size={17} />
                          </Link>
                          <Link
                            aria-label="Edit employee"
                            title="Edit"
                            to={`/employees/${e.id}/edit`}
                          >
                            <Pencil size={17} />
                          </Link>
                          <button
                            aria-label="Delete employee"
                            title="Delete"
                            onClick={() =>
                              ask(
                                `Delete ${e.name}? This also removes their leave and attendance records.`,
                                () => deleteEmployee(e.id),
                              )
                            }
                          >
                            <Trash2 size={17} />
                          </button>
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
              total={filtered.length}
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
