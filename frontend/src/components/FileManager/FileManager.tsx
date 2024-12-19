import { useFileManager } from "./useFileManager";
import FolderNavigation from "./FolderNavigation";
import Actions from "./Actions";
import ItemList from "./ItemList";

export default function FileManager() {
  const { folderHistory, goBack } = useFileManager();

  return (
    <div>
      <Actions onGoBack={goBack} disableGoBack={folderHistory.length === 1} />
      <FolderNavigation />
      <ItemList />
    </div>
  );
}
