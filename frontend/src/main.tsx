import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Router.tsx";
import { FileManagerProvider } from "./components/FileManager/useFileManager.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <FileManagerProvider>
        <Router></Router>
      </FileManagerProvider>
    </DndProvider>
  </StrictMode>
);
