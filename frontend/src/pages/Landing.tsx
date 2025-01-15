import React from "react";
import styles from "../styles/Landing.module.css";
import { useNavigate } from "react-router";



const Landing: React.FC = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("login");
  };

  const navigateToRegister = () => {
    navigate("register");
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.logo}>DocFlow</div>
        <nav className={styles.nav}>
          <button onClick={navigateToLogin} className={styles.navButton}>
            Login
          </button>
          <button
            onClick={navigateToRegister}
            className={styles.navButtonPrimary}
          >
            Register
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Simplify Your Workflow with DocFlow</h1>
        <p className={styles.subtitle}>
          Create, organize, and manage your documents efficiently. A powerful
          editor built for productivity.
        </p>
        <button className={styles.ctaButton} onClick={navigateToRegister}>
          Get Started for Free
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} Fuck You. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
