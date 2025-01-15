import React, { useState } from "react";
import styles from "../styles/Register.module.css";
import { NavLink } from "react-router-dom";
import { register } from "../api/apiService";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const handleRegister = async () => {
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await register(username, password);
      console.log(response);
      setIsRegistered(true);
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {!isRegistered ? (
          <>
            <h2 className={styles.title}>Register</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Repeat Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className={styles.input}
            />
            <button className={styles.registerButton} onClick={handleRegister}>
              Register
            </button>
            <p style={{ color: "red", height: "10px", textAlign: "center", marginTop: "5px" }}>{error}</p>
          </>
        ) : (
          <div>
            You registered successfully. <NavLink to="/login">Login.</NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
