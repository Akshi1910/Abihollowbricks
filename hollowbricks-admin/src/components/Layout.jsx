import React from "react";
import Sidebar from "./Sidebar"; // Sidebar remains in all pages
import { Outlet } from "react-router-dom"; // Outlet renders selected page

const Layout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen w-full">
        <Outlet /> {/* Renders the page content dynamically */}
      </div>
    </div>
  );
};

export default Layout;
