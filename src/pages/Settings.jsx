import React, { useState } from "react";
import { Moon, Sun, RotateCcw, Save, ShieldCheck, User, UserRound } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Avatar, PageHeader } from "../components/UI";
export default function Settings() {
  const { settings, setSettings, notify, reset, ask } = useApp();
  const [form, setForm] = useState(settings);
  const [error, setError] = useState("");
  const save = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Enter a valid display name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email");
      return;
    }
    setSettings({ ...form, name: form.name.trim() });
    setError("");
    notify("Settings saved");
  };
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and application preferences."
      />
      <div className="settings-layout">
        <form className="panel pad" onSubmit={save}>
          <h2>Profile Settings</h2>
          <p className="section-subtitle">
            Update your administrator profile information.
          </p>
          <div className="settings-avatar">
            <div className="avatar">
              <User size={32} />
            </div>
            <div>
              <strong>{form.name}</strong>
              <span>Workspace Administrator</span>
            </div>
          </div>
          <label className="field">
            <span>Display Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Email Address</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          {error && <p className="field-error">{error}</p>}
          <button className="btn btn-primary" type="submit">
            <Save size={17} /> Save Profile
          </button>
        </form>
        <div className="settings-side">
          <section className="panel pad">
            <h2>Appearance</h2>
            <p className="section-subtitle">
              Choose your preferred interface theme.
            </p>
            <div className="theme-options">
              {[
                ["light", "Light", Sun],
                ["dark", "Dark", Moon],
              ].map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  className={`theme-choice ${form.theme === value ? "selected" : ""}`}
                  onClick={() => {
                    setForm({ ...form, theme: value });
                    setSettings((p) => ({ ...p, theme: value }));
                  }}
                >
                  <Icon size={24} />
                  <strong>{label} Mode</strong>
                  <span>
                    {form.theme === value ? "Selected" : "Select theme"}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="panel pad">
            <h2>Demo Data</h2>
            <p className="section-subtitle">
              Restore the original sample employee, department, leave, and
              attendance records.
            </p>
            <button
              className="btn btn-ghost"
              onClick={() =>
                ask(
                  "Restore the original demo records? All current changes to demo records will be lost.",
                  reset,
                )
              }
            >
              <RotateCcw size={17} /> Reset Demo Data
            </button>
          </section>
          <section className="panel pad security-note">
            <ShieldCheck size={22} />
            <div>
              <strong>Local demo application</strong>
              <p>
                Data is saved in this browser's localStorage. No backend or real
                authentication is connected.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
