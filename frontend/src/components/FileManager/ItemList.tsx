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
  position: { left: number; top: number }
}


export default function ItemList(props: ItemListProps) {
  const { currentContent } = useFileManager();
  const [showOptions, setShowOptions] = useState<ItemOptions | null>(null);
  const { view } = props;

  useEffect(() => {
    setShowOptions(null);
  }, [currentContent]);

  return (
    <div className={view === "List" ? styles.listView : styles.gridView}>
      {currentContent &&
        [...currentContent.folders, ...currentContent.documents].map(
          (item: Folder | Document, indx: number) => {
            const isFolder = (item as Folder).name !== undefined;
            return (
              <Item
                item={item}
                key={`${item.id}-${isFolder ? "folder" : "document"}`}
                isFolder={isFolder}
                setShowOptions={setShowOptions}
                indx={indx}
                showOptions={showOptions}
                view={view}
              />
            );
          }
        )}
    </div>
  );
}
