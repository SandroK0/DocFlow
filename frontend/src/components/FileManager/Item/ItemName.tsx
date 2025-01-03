import React from "react";
import { Folder, Document } from "../../../Types";
import styles from "../../../styles/FileManager/ItemList.module.css";

interface ItemNameProps {
  item: Folder | Document;
  isFolder: boolean;
  renaming: boolean;
  rnInputValue: string;
  setRnInputValue: (value: string) => void;
}

const ItemName: React.FC<ItemNameProps> = ({
  item,
  isFolder,
  renaming,
  rnInputValue,
  setRnInputValue,
}) => {
  return renaming ? (
    <input
      type="text"
      className={styles.input}
      value={rnInputValue}
      onChange={(e) => setRnInputValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  ) : (
    <span>{isFolder ? (item as Folder).name : (item as Document).title}</span>
  );
};

export default ItemName;
