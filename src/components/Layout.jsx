import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Settings,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  ChevronDown,
  BriefcaseBusiness,
  X,
} from "lucide-react";
import { Avatar, GlobalFeedback } from "./UI";
import { useApp } from "../context/AppContext";
const links = [
  ["/", "Dashboard", LayoutDashboard],
  ["/employees", "Employees", Users],
  ["/departments", "Departments", Building2],
  ["/leaves", "Leave Requests", CalendarDays],
  ["/attendance", "Attendance", ClipboardCheck],
  ["/settings", "Settings", Settings],
];
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { settings, leaves } = useApp();
  const location = useLocation();
  const pending = leaves.filter((l) => l.status === "Pending").length;
  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""}`}>
      <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={22} />
          </div>
          <span>
            Stack<span className="brand-accent">ly</span>
            <small>WORKFORCE SUITE</small>
          </span>
          <button
            className="mobile-close icon-btn"
            onClick={() => setMobile(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {links.map(([path, label, Icon]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setMobile(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              title={label}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Leave Requests" && pending > 0 && (
                <b className="nav-count">{pending}</b>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {/* <div className="help-card">
            <div>Need assistance?</div>
            <p>Manage your workforce with confidence.</p>
          </div> */}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
            <span>Collapse sidebar</span>
          </button>
        </div>
      </aside>
      {mobile && (
        <div className="sidebar-overlay" onClick={() => setMobile(false)} />
      )}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn mobile-menu"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb">
              Workspace <span>/</span>{" "}
              <strong>
                {links.find(([p]) => p === location.pathname)?.[1] ||
                  "Employee Details"}
              </strong>
            </span>
          </div>
          <div className="topbar-right">
            <span className="today-date">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <NavLink
              to="/leaves"
              className="icon-btn notification"
              aria-label="Leave requests"
            >
              <Bell size={20} />
              {pending > 0 && <i />}
            </NavLink>
            <div className="admin-user">
              <Avatar name={settings.name} size={36} />
              <div>
                <strong>{settings.name}</strong>
                <small>Administrator</small>
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <GlobalFeedback />
    </div>
  );
}
