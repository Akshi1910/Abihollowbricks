import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <h1>Abi Hollow Bricks</h1>
        <p className={styles.para}>Vellakovil Muthur Road</p>
      </div>

      <ul className={styles.navLinks}>
        <li><Link to="/" className={styles.active}>HOME</Link></li>
        <li><Link to="/about">ABOUT</Link></li>
        <li><Link to="/service">SERVICE</Link></li>
        <li><Link to="/order">ORDER</Link></li>
        <li><Link to="/contact">REACH US</Link></li>

        {/* Show this only if logged in */}
        {isAuthenticated && (
          <li><Link to="/user-dashboard">MY ORDERS</Link></li>
        )}
      </ul>

      <div className={styles.authButtons}>
        {isAuthenticated ? (
          <>
            <span className={styles.userName}>Welcome, {user.name}</span>
            <button
              className={styles.authButton}
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </button>
          </>
        ) : (
          <button className={styles.authButton} onClick={() => loginWithRedirect()}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
