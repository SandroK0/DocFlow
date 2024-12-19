import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Router.tsx";
import { FileManagerProvider } from "./components/FileManager/useFileManager.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FileManagerProvider>
      <Router></Router>
    </FileManagerProvider>
  </StrictMode>
);
