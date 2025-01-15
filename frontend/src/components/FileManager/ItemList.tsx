import styles from "../../styles/./FileManager/ItemList.module.css";
import { Folder, Document } from "../../Types";
import { useFileManager } from "./useFileManager";
import Item from "./Item/Item";
import { useEffect, useState } from "react";




interface ItemOptions {
  indx: number;
  position: { left: number; top: number };
}

export default function ItemList() {
  const { currentContent, selectItemToggle, selectedItems, setSelectedItems } =
    useFileManager();
  const [showOptions, setShowOptions] = useState<ItemOptions | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
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
    <div
      className={styles.listView}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedItems([]);
        }
        e.stopPropagation();
      }}
    >
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
              />
            );
          }
        )}
    </div>
  );
}
