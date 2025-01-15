import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router";
import { login } from "../api/apiService";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      const accessToken = response.access_token;
      if (accessToken) {
        localStorage.setItem("jwt", accessToken);
        navigate("/workspace");
      }
    } catch (err: any) {
      setError(err.response.data.message);
    }
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
        <p style={{ color: "red", height: "10px", textAlign: "center", marginTop: "5px" }}>{error}</p>
      </div>
    </div>
  );
};

export default Login;
