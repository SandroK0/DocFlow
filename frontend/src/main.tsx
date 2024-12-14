import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ApiTesting from "./components/ApiTesting.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApiTesting></ApiTesting>
  </StrictMode>
);
