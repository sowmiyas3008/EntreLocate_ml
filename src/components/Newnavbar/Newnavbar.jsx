import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "./Newnavbar.css";
import logon from "C:\\Users\\balas\\Documents\\EntreLocate\\entreloc\\src\\assets\\newlogob.png";


const Newnavbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/Mainpage">Home</Link></li>
      </ul>
      <img src={logon} className="logo" alt="logo" />
    </nav>
  );
};

export default Newnavbar;
