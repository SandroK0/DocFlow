import styles from "../../styles/FileManager.module.css";
import { Folder, Document } from "../../Types";
import { useFileManager } from "./useFileManager";
import { Item } from "./Item";

export default function ItemList() {
  const { currentContent } = useFileManager();

  console.log(currentContent);

  return (
    <div className={styles.container}>
      {currentContent &&
        [...currentContent.folders, ...currentContent.documents].map(
          (item: Folder | Document, indx: number) => {
            const isFolder = (item as Folder).name !== undefined;
            return <Item item={item} key={indx} isFolder={isFolder} />;
          },
        )}
    </div>
  );
}
