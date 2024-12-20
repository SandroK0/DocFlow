import styles from "../../styles/./FileManager/ItemList.module.css";
import { Folder, Document } from "../../Types";
import { useFileManager } from "./useFileManager";
import { Item } from "./Item";
import { useState } from "react";

export default function ItemList() {
  const { currentContent } = useFileManager();
  const [showOptions, setShowOptions] = useState<number | null>(0);

  return (
    <div className={styles.container}>
      {currentContent &&
        [...currentContent.folders, ...currentContent.documents].map(
          (item: Folder | Document, indx: number) => {
            const isFolder = (item as Folder).name !== undefined;
            return (
              <Item
                item={item}
                key={indx}
                isFolder={isFolder}
                setShowOptions={setShowOptions}
                indx={indx}
                showOptions={showOptions}
              />
            );
          }
        )}
    </div>
  );
}
