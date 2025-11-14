// // Navbar.js
// import React from "react";
// import "./Navbar.css"; // Create CSS similar to your existing navbar styles
// import { Link } from "react-router-dom";


// const Navbar = () => {
//   return (
//     <header className="dashboard-navbar">
//       <div className="dashboard-logo">MultiTalk</div>
//       <nav className="dashboard-nav">
//         <Link to="/about">About</Link>
//         <Link to="/contact">Contact</Link>
//         <Link to="/dashboard">Dashboard</Link>
//         <Link to="/logout">Logout</Link>
//       </nav>
//     </header>
//   ); 
// };

// export default Navbar;


// Navbar.js
import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-logo">MultiTalk</div>
      
      {/* Hamburger Button - Only visible on mobile */}
      <button 
        className={`hamburger-btn ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Navigation Menu */}
      <nav className={`dashboard-nav ${isMenuOpen ? 'menu-open' : ''}`}>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
        {/* <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link> */}
        <Link to="/" onClick={closeMenu}>Logout</Link>
      </nav>
    </header>
  );
};

export default Navbar;
