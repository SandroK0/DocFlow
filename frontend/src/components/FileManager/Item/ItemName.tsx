import { forwardRef, useImperativeHandle, useRef } from "react";
import { Folder, Document } from "../../../Types";
import styles from "../../../styles/FileManager/ItemList.module.css";

interface ItemNameProps {
  item: Folder | Document;
  isFolder: boolean;
  renaming: boolean;
  rnInputValue: string;
  setRnInputValue: (value: string) => void;
}

export interface ItemNameRef {
  focusInput: () => void;
}

const ItemName = forwardRef<ItemNameRef, ItemNameProps>(
  ({ item, isFolder, renaming, rnInputValue, setRnInputValue }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose focusInput to parent
    useImperativeHandle(ref, () => ({
      focusInput: () => {
        console.log("focus")
        inputRef.current?.focus();
      },
    }));

    return renaming ? (
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={rnInputValue}
        onChange={(e) => setRnInputValue(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
    ) : (
      <span>{isFolder ? (item as Folder).name : (item as Document).title}</span>
    );
  }
);

export default ItemName;

