import React from "react";
import { Outlet } from "react-router-dom";
import PatientSidebar from "../components/PatientSideBar"; // ✅ Make sure the path is correct

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <PatientSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
