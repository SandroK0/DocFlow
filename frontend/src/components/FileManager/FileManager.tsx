import { useFileManager } from "./useFileManager";
import Actions from "./Actions";
import ItemList from "./ItemList";
import Path from "./Path";
import { useState } from "react";

export default function FileManager() {
  const { folderHistory, goBack, handlePathClick } = useFileManager();

  const [view, setView] = useState<"Grid" | "List">("List");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "80%",
      }}
    >
      <Actions
        onGoBack={goBack}
        disableGoBack={folderHistory.length === 1}
        view={view}
        setView={setView}
      />
      <Path folderHistory={folderHistory} handlePathClick={handlePathClick} />
      <ItemList view={view} setView={setView} />
    </div>
  );
}
