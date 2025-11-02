// Navbar.js
import React from "react";
import "./Navbar.css"; // Create CSS similar to your existing navbar styles
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <header className="dashboard-navbar">
      <div className="dashboard-logo">MultiTalk</div>
      <nav className="dashboard-nav">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/logout">Logout</Link>
      </nav>
    </header>
  );
};

export default Navbar;
