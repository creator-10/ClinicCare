import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex">
      <SideBar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;