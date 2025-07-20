import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const adminNav = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/reports" },
  { text: "Add Doctor", icon: <PersonAddIcon />, path: "/admin/add-doctor" },
  { text: "Doctors List", icon: <GroupsIcon />, path: "/admin/doctors-list" },
];

const doctorNav = [
  { text: "Dashboard Home", icon: <DashboardIcon />, path: "/doctor" },
  { text: "Visit Record", icon: <AssignmentIcon />, path: "/doctor/visit-record" },
  { text: "Availability Slots", icon: <EventAvailableIcon />, path: "/doctor/availability" },
];

const SideBar = () => {
  const location = useLocation();
  const { role } = useSelector((state) => state.auth);

  const navItems = role === "admin" ? adminNav : doctorNav;
  const panelTitle = role === "admin" ? "Admin Panel" : "Doctor Panel";

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <span className="text-xl font-bold text-teal-600">{panelTitle}</span>
      </div>
      <nav className="flex-1 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.text}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 hover:bg-teal-50 transition-colors rounded-r-full ${
                  location.pathname === item.path
                    ? "bg-teal-100 text-teal-700 font-semibold"
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
  );
};

export default SideBar;