import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">MyApp</Link>
      </div>

      <div className={styles.navActions}>
        {location.pathname === "/home" ? (
          <div className={styles.userSection}>
            {/* Optional user avatar or username can go here */}

            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link className={styles.navLink} to="/login">
              Login
            </Link>

            <Link className={styles.signupBtn} to="/signup">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
