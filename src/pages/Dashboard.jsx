import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  Building2,
  CalendarClock,
  ArrowUpRight,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useApp } from "../context/AppContext";
import { Avatar, Badge, PageHeader } from "../components/UI";
import { prettyDate } from "../utils/helpers";
export default function Dashboard() {
  const { employees, departments, leaves } = useApp();
  const active = employees.filter((e) => e.status === "Active").length;
  const pending = leaves.filter((l) => l.status === "Pending").length;
  const stats = [
    ["Total Employees", employees.length, Users, "blue"],
    ["Active Employees", active, UserCheck, "green"],
    ["Departments", departments.length, Building2, "purple"],
    ["Pending Leaves", pending, CalendarClock, "orange"],
  ];
  const deptData = departments.map((d, i) => ({
    name: d.name,
    value: employees.filter((e) => e.department === d.name).length,
    color: ["#6366f1", "#14b8a6", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"][
      i % 6
    ],
  }));
  const chartData = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map(
    (month, i) => ({
      month,
      employees: Math.max(0, employees.length - 10 + i * 2),
    }),
  );
  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Here's what's happening with your workforce today."
        action={
          <Link className="btn btn-primary" to="/employees/new">
            <Plus size={17} /> Add Employee
          </Link>
        }
      />
      <div className="stats-grid">
        {stats.map(([label, value, Icon, color]) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}>
              <Icon size={22} />
            </div>
            <span>{label}</span>
            <div className="stat-value">
              {value}
              <ArrowUpRight size={19} />
            </div>
            <small>Workforce overview</small>
          </div>
        ))}
      </div>
      <div className="dashboard-charts">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Employee Growth</h2>
              <p>Illustrative workforce trend</p>
            </div>
            <span className="muted-pill">Last 6 months</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 4"
                  vertical={false}
                  stroke="#e9edf5"
                />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip />
                <Area
                  dataKey="employees"
                  type="monotone"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#growth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>By Department</h2>
              <p>Team distribution</p>
            </div>
          </div>
          <div className="donut-wrap">
            <div className="donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {deptData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <strong>{employees.length}</strong>
                <span>Employees</span>
              </div>
            </div>
            <div className="legend">
              {deptData.map((d) => (
                <div key={d.name}>
                  <i style={{ background: d.color }} />
                  {d.name}
                  <strong>{d.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Recently Joined Employees</h2>
            <p>Latest additions to your team</p>
          </div>
          <Link className="text-link" to="/employees">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...employees]
                .sort((a, b) => b.joined.localeCompare(a.joined))
                .slice(0, 5)
                .map((e, i) => (
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
                    <td>{e.department}</td>
                    <td>{e.role}</td>
                    <td>{prettyDate(e.joined)}</td>
                    <td>
                      <Badge value={e.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
