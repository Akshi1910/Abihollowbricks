import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true } // ✅ Ensures cookies are sent and received
      );

      const { role } = response.data;

      // ✅ Navigate based on role
      if (role === "admin") navigate("/dashboard");
      else if (role === "manager") navigate("/d");
      else navigate("/employee-dashboard");
      
    } catch (error) {
      console.error("Login Error:", error.response || error);
      alert(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Side (Image) */}
      <div className={styles.left}></div>

      {/* Right Side (Form) */}
      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleLogin}>
          <h2 className={styles.title}>Login</h2>

          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.button}>
            Login
          </button>

          <a href="/register" className={styles.link}>
            Don’t have an account? Sign up
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
