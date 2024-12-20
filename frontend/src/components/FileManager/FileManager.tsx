import { useFileManager } from "./useFileManager";
import Actions from "./Actions";
import ItemList from "./ItemList";
import Path from "./Path";

export default function FileManager() {
  const { folderHistory, goBack } = useFileManager();

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
      <Actions onGoBack={goBack} disableGoBack={folderHistory.length === 1} />
      <Path />
      <ItemList />
    </div>
  );
}
