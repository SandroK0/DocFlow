import axios from "axios";
import { useEffect, useState } from "react";
import "../index.css";

export default function ApiTesting() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setAccessToken(localStorage.getItem("jwt"));
    }
  }, []);

  function handleLogin() {
    axios
      .post("http://127.0.0.1:5000/login", {
        username: "test",
        password: "test",
      })
      .then((resp) => {
        console.log(resp.data.access_token);
        const accessToken = resp.data.access_token;
        if (accessToken) {
          localStorage.setItem("jwt", resp.data.access_token);
          setAccessToken(accessToken);
        }
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setAccessToken(null);
  }
  3;

  function handleCreateDocument() {
    axios
      .post(
        "http://127.0.0.1:5000/documents",
        {
          title: "test_doc",
          content: "Hello, World!",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken?.toString()}`, // JWT token
            "Content-Type": "application/json", // Add this header
          },
        }
      )
      .then((response) => console.log(response.data))
      .catch((error) => {
        if (error.response) {
          console.error("Error:", error.response.data); // Logs the error message from the backend
        } else {
          console.error("Error:", error.message);
        }
      });
  }

  function handleGetDocument() {
    axios
      .get("http://127.0.0.1:5000/documents/1", {
        headers: {
          Authorization: `Bearer ${accessToken?.toString()}`, // JWT token
          "Content-Type": "application/json", // Add this header
        },
      })
      .then((response) => console.log(response.data))
      .catch((error) => {
        if (error.response) {
          console.error("Error:", error.response.data); // Logs the error message from the backend
        } else {
          console.error("Error:", error.message);
        }
      });
  }

  return (
    <div className="ApiTesting">
      <div>
        access_token: <span style={{ fontSize: "10px" }}>{accessToken}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "500px",
        }}
      >
        {!accessToken ? (
          <button onClick={handleLogin}>Login</button>
        ) : (
          <button onClick={handleLogout}>Log Out</button>
        )}
        <button onClick={handleCreateDocument}>create document</button>
        <button onClick={handleGetDocument}>create document</button>
      </div>
    </div>
  );
}
