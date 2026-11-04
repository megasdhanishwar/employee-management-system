import React from "react";
import { Search, Inbox, X } from "lucide-react";
import { initials, colors } from "../utils/helpers";
import { useApp } from "../context/AppContext";
export function Avatar({ name, size = 40, index = 0 }) {
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: colors[index % colors.length],
        fontSize: size * 0.32,
      }}
    >
      {initials(name)}
    </span>
  );
}
export function Badge({ value }) {
  return (
    <span
      className={`badge badge-${String(value).toLowerCase().replaceAll(" ", "-")}`}
    >
      {value}
    </span>
  );
}
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && <div className="header-action">{action}</div>}
    </div>
  );
}
export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="search-box">
      <Search size={17} />
      <input
        aria-label="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
export function Empty({
  message = "No records found",
  hint = "Try adjusting your search or filters.",
}) {
  return (
    <div className="empty">
      <Inbox size={38} />
      <h3>{message}</h3>
      <p>{hint}</p>
    </div>
  );
}
export function Pagination({ page, setPage, total, perPage }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="pagination">
      <span>
        Showing {total ? (page - 1) * perPage + 1 : 0}–
        {Math.min(page * perPage, total)} of {total}
      </span>
      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          {page} / {pages}
        </span>
        <button disabled={page === pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
export function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function GlobalFeedback() {
  const { toast, confirm, setConfirm } = useApp();
  return (
    <>
      {toast && (
        <div role="status" className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
      {confirm && (
        <div className="modal-backdrop">
          <div className="confirm-box" role="alertdialog" aria-modal="true">
            <h2>Confirm action</h2>
            <p>{confirm.message}</p>
            <div className="form-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  confirm.onConfirm();
                  setConfirm(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
