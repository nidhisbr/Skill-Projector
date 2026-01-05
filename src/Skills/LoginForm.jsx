import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // <-- module import

export default function LoginForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState("submitter");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Signing in...");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const token = res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        setMsg("Login successful");
        navigate("/home");
      } else setMsg("Login succeeded but token missing");
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || err.response?.data || err.message;
      setMsg("Login failed: " + serverMsg);
    }
  };

  return (
    <div className={styles.forms}>
      <form className={styles.loginContainer} onSubmit={handleSubmit}>
        <h1 className={styles.title}>LOGIN</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="role">Are you</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="submitter">Submitter</option>
            <option value="reviewer">Reviewer</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className={styles.button} type="submit">
          SIGN IN
        </button>

        <div style={{ marginTop: 12, minHeight: 20 }}>{msg}</div>

        <div className={styles.divider}>OR</div>

        <div className={styles.socialLogin}>
          <div className={styles.socialBtn}>G</div>
          <div className={styles.socialBtn}>F</div>
          <div className={styles.socialBtn}>X</div>
        </div>

        <div className={styles.footer}>
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </form>
    </div>
  );
}
