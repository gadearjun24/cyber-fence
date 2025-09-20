import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";
function Layout({ type }) {
  return (
    <div>
      <Sidebar role={type} />
      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
