import styles from "../../styles/./FileManager/ItemList.module.css";
import { Folder, Document } from "../../Types";
import { useFileManager } from "./useFileManager";
import Item from "./Item/Item";
import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";

interface ItemListProps {
  view: "Grid" | "List";
  setView: Dispatch<SetStateAction<"Grid" | "List">>;
}

interface ItemOptions {
  indx: number;
  position: { left: number; top: number };
}

export default function ItemList(props: ItemListProps) {
  const { currentContent, selectItemToggle, selectedItems } = useFileManager();
  const [showOptions, setShowOptions] = useState<ItemOptions | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const { view } = props;
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      setIsShiftPressed(true);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      setIsShiftPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    setShowOptions(null);
  }, [currentContent]);

  return (
    <div className={view === "List" ? styles.listView : styles.gridView}>
      {currentContent &&
        [...currentContent.folders, ...currentContent.documents].map(
          (item: Folder | Document, indx: number) => {
            const isFolder = (item as Folder).name !== undefined;
            const isSelected = selectedItems.includes(item);
            return (
              <Item
                item={item}
                key={`${item.id}-${isFolder ? "folder" : "document"}`}
                isFolder={isFolder}
                setShowOptions={setShowOptions}
                indx={indx}
                showOptions={showOptions}
                selectItemToggle={() =>
                  selectItemToggle(item, isSelected, isShiftPressed)
                }
                isSelected={isSelected}
                view={view}
              />
            );
          }
        )}
    </div>
  );
}
