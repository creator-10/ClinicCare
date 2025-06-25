import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Add Doctor", icon: <PersonAddIcon />, path: "/admin/add-doctor" },
  { text: "Doctors List", icon: <GroupsIcon />, path: "/admin/doctors-list" },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">Admin Panel</span>
        </div>
        <nav className="flex-1 py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.text}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 hover:bg-blue-50 transition-colors rounded-r-full ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;