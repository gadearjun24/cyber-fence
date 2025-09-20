import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import * as LucideIcons from "lucide-react"; // using lucide-react for icons
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true); // default open
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSidebarOnClickOutside);
    return () => {
      document.removeEventListener("mousedown", closeSidebarOnClickOutside);
    };
  }, []);

  const links1 = [
    { name: "Dashboard", icon: <LucideIcons.Home />, link: "/" },
    { name: "History", icon: <LucideIcons.History />, link: "/history" },
    {
      name: "Notifications",
      icon: <LucideIcons.Bell />,
      link: "/notifications",
    },
    { name: "User Profile", icon: <LucideIcons.User />, link: "/profile" },
  ];

  const links2 = [
    { name: "Dashboard", icon: <LucideIcons.Home />, link: "/" },
    {
      name: "User Management",
      icon: <LucideIcons.Users />,
      link: "/manage-users",
    },
    {
      name: "User Files History",
      icon: <LucideIcons.History />,
      link: "/user-files-history",
    },
    {
      name: "Notifications",
      icon: <LucideIcons.Bell />,
      link: "/notifications",
    },
    { name: "Profile", icon: <LucideIcons.User />, link: "/profile" },
  ];

  useEffect(() => {
    if (role === "user") {
      setLinks(links1);
    } else if (role === "admin") {
      setLinks(links2);
    }
  }, [role]);
  return (
    <>
      {/* Toggle Button */}
      <button
        className={`sidebar-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <LucideIcons.Menu />
      </button>

      {/* Overlay for mobile */}
      {isOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">CyberFence</h1>
          <button
            className="sidebar-close-btn"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            <LucideIcons.X />
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {links.map((link) => (
              <li key={link.name} className="nav-item">
                <NavLink
                  to={link.link}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={() => toggleSidebar()}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
