import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { MdOutlineFactCheck } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { MdOutlineInventory } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/dashboard" },
    { name: "Orders", icon: <MdOutlineFactCheck />, path: "/orders" },
    { name: "Stock", icon: <AiOutlineStock />, path: "/stock" },
    { name: "Inventory", icon: <MdOutlineInventory />, path: "/inventory" },
    
  ];

  return (
    <div className={styles.sidebar}>
      <h2>Abi Hollow Bricks</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`${styles.menuItem} ${
              location.pathname === item.path ? styles.active : ""
            }`}
          >
            <Link to={item.path} className={styles.link}>
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
        <li className={`${styles.menuItem} ${styles.logout}`}>
          
          <Link to="/" className={styles.link}>
          <FaSignOutAlt />
          <span>Logout</span>
            </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
