import React, { createContext, useContext, useEffect, useState } from "react";
import {
  seedEmployees,
  seedDepartments,
  seedLeaves,
  seedAttendance,
} from "../data/seed";
const AppContext = createContext(null);
function stored(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
export function AppProvider({ children }) {
  const [employees, setEmployees] = useState(() =>
    stored("pp_employees", seedEmployees),
  );
  const [departments, setDepartments] = useState(() =>
    stored("pp_departments", seedDepartments),
  );
  const [leaves, setLeaves] = useState(() => stored("pp_leaves", seedLeaves));
  const [attendance, setAttendance] = useState(() =>
    stored("pp_attendance", seedAttendance),
  );
  const [settings, setSettings] = useState(() =>
    stored("pp_settings", {
      name: "Admin User",
      email: "admin@stackly.demo",
      theme: "light",
    }),
  );
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  useEffect(() => {
    localStorage.setItem("pp_employees", JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem("pp_departments", JSON.stringify(departments));
  }, [departments]);
  useEffect(() => {
    localStorage.setItem("pp_leaves", JSON.stringify(leaves));
  }, [leaves]);
  useEffect(() => {
    localStorage.setItem("pp_attendance", JSON.stringify(attendance));
  }, [attendance]);
  useEffect(() => {
    localStorage.setItem("pp_settings", JSON.stringify(settings));
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  const notify = (message, type = "success") => setToast({ message, type });
  const ask = (message, onConfirm) => setConfirm({ message, onConfirm });
  const addEmployee = (data) => {
    const id = `EMP-${Date.now()}`;
    setEmployees((p) => [{ ...data, id }, ...p]);
    setAttendance((p) => [
      { employeeId: id, present: 0, absent: 0, late: 0, workingDays: 23 },
      ...p,
    ]);
    notify("Employee added successfully");
  };
  const updateEmployee = (id, data) => {
    setEmployees((p) => p.map((e) => (e.id === id ? { ...e, ...data } : e)));
    notify("Employee updated successfully");
  };
  const deleteEmployee = (id) => {
    setEmployees((p) => p.filter((e) => e.id !== id));
    setAttendance((p) => p.filter((a) => a.employeeId !== id));
    setLeaves((p) => p.filter((l) => l.employeeId !== id));
    notify("Employee deleted");
  };
  const addDepartment = (data) => {
    setDepartments((p) => [...p, { ...data, id: `DEP-${Date.now()}` }]);
    notify("Department added");
  };
  const updateDepartment = (id, data) => {
    const old = departments.find((d) => d.id === id);
    setDepartments((p) => p.map((d) => (d.id === id ? { ...d, ...data } : d)));
    if (old && old.name !== data.name)
      setEmployees((p) =>
        p.map((e) =>
          e.department === old.name ? { ...e, department: data.name } : e,
        ),
      );
    notify("Department updated");
  };
  const deleteDepartment = (id) => {
    setDepartments((p) => p.filter((d) => d.id !== id));
    notify("Department deleted");
  };
  const updateLeave = (id, status) => {
    setLeaves((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
    notify(`Leave ${status.toLowerCase()}`);
  };
  const reset = () => {
    setEmployees(seedEmployees);
    setDepartments(seedDepartments);
    setLeaves(seedLeaves);
    setAttendance(seedAttendance);
    notify("Demo data restored");
  };
  return (
    <AppContext.Provider
      value={{
        employees,
        departments,
        leaves,
        attendance,
        settings,
        setSettings,
        toast,
        confirm,
        setConfirm,
        notify,
        ask,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        updateLeave,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export const useApp = () => useContext(AppContext);
