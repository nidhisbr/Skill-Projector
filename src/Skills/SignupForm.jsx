import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth"; // Adjust path if needed
import styles from "./Signup.module.css"; // Using CSS module

export default function SignupForm() {
  // Form state
  const [role, setRole] = useState("submitter");
  const [level, setLevel] = useState(1);
  const [empid, setEmpid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UX state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const payload = {
      empid,
      email,
      password,
      role,
      level,
    };

    try {
      const res = await signup(payload);

      if (res?.token) {
        localStorage.setItem("jwtToken", res.token);
        setSuccessMsg("Signup successful — logging you in...");
        navigate("/home");
      } else {
        setSuccessMsg("Signup successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 900);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Signup failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["signup-forms"]}>
      <div className={styles["signup-container"]}>
        <h1>SIGN UP</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <label htmlFor="role">Are you</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="submitter">Submitter</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="level">Level</label>
            <select
              id="level"
              name="level"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="empid">EMPLOYEE ID</label>
            <input
              type="text"
              id="empid"
              name="empid"
              placeholder="122345"
              value={empid}
              onChange={(e) => setEmpid(e.target.value)}
            />
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {error && <div style={{ color: "crimson", marginTop: 12 }}>{error}</div>}
        {successMsg && <div style={{ color: "green", marginTop: 12 }}>{successMsg}</div>}

        <div className={styles["divider"]}>OR</div>

        <div className={styles["social-login"]}>
          <div className={styles["social-btn"]}>G</div>
          <div className={styles["social-btn"]}>F</div>
          <div className={styles["social-btn"]}>X</div>
        </div>

        <div className={styles["footer"]}>
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}
