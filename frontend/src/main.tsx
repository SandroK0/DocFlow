import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Router.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

createRoot(document.getElementById("root")!).render(
  <DndProvider backend={HTML5Backend}>
      <Router></Router>
  </DndProvider>
);
