import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Register.module.css";
import { NavLink } from "react-router-dom";
import { API_URL } from "../config";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const handleRegister = () => {
    axios
      .post(`${API_URL}/user/register`, {
        username,
        email,
        password,
      })
      .then((resp) => {
        if (resp.status === 201) {
          setIsRegistered(true);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.msg) {
          setMessage(error.response.data.msg);
        } else {
          setMessage("Registration failed. Please try again.");
        }
      });
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            <button className={styles.registerButton} onClick={handleRegister}>
              Register
            </button>
            {message && <p className={styles.message}>{message}</p>}
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
