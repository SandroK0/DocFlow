import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router";
import { API_URL } from "../config";



const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleLogin = () => {
    axios
      .post(`${API_URL}/user/login`, {
        username,
        password,
      })
      .then((resp) => {
        console.log(resp.data);
        const accessToken = resp.data.access_token;
        if (accessToken) {
          localStorage.setItem("jwt", accessToken);
          navigate("/workspace")
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Login</h2>
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
        <button className={styles.loginButton} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

