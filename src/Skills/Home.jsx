import { useState, useEffect } from "react";
import { getHello } from "../api/protectedApi";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ✅ Fetch username
  useEffect(() => {
    getHello()
      .then((res) => {
        setMessage(res.data.username);
      })
      .catch(() => setMessage("Error calling protected endpoint"));
  }, []);

  // ✅ Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault(); // Prevent immediate back navigation
      setShowPopup(true);     // Show popup
      window.history.pushState(null, "", window.location.pathname);
    };

    // Push initial state so back button can be detected
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className={styles.homeForms}>
      <h2 className={styles.welcomeTitle}>
        Welcome <span>{message}</span>
      </h2>

      <form className={styles.homeForm}>
        <div className={styles.formGrid}>
          {/* Column 1 */}
          <div className={styles.formGroup}>
            <p className={styles.sectionLabel}>Did you finish:</p>

            <label className={styles.checkboxItem}>
              <input type="checkbox" />
              Skill
            </label>

            <label className={styles.checkboxItem}>
              <input type="checkbox" />
              Learning Path
            </label>
          </div>

          {/* Column 2 */}
          <div className={styles.formGroup}>
            <p className={styles.sectionLabel}>
              Do you have coding experience? Add your key skills:
            </p>

            <textarea
              className={styles.textarea}
              rows="6"
              placeholder="Enter your skills..."
            />

            <p className={`${styles.sectionLabel} ${styles.mt3}`}>
              Difficulty level:
            </p>

            <label className={styles.checkboxItem}>
              <input type="checkbox" />
              Easy
            </label>

            <label className={styles.checkboxItem}>
              <input type="checkbox" />
              Moderate
            </label>

            <label className={styles.checkboxItem}>
              <input type="checkbox" />
              Hard
            </label>
          </div>
        </div>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <p>Do you want to logout or save the changes?</p>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
              }}
            >
              Logout
            </button>

            <button
              onClick={() => {
                setShowPopup(false);
                // Push state to cancel back navigation
                window.history.pushState(null, "", window.location.pathname);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
