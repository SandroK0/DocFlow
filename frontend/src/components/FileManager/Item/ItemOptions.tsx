import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import styles from "../../../styles/FileManager/ItemOptions.module.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { MdDriveFileMoveOutline } from "react-icons/md";

interface ItemOptionsProps {
  closeOptions: () => void;
  handleRenameClick: () => void;
  handleRenameFolder: (id: number, newName: string) => void;
  handleRenameDocument: (id: number, newName: string) => void;
  position: { left: number; top: number };
  setModal: Dispatch<SetStateAction<"Delete" | "Move" | null>>;
}

const ItemOptions: React.FC<ItemOptionsProps> = ({
  position,
  handleRenameClick,
  closeOptions,
  setModal,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listener to close the menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeOptions();
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeOptions]);

  return (
    <>
      <div
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
        className={styles.itemOptions}
        style={{ left: `${position.left - 200}px`, top: `${position.top}px` }}
      >
        <button
          className={styles.button}
          onClick={() => {
            handleRenameClick();
            closeOptions();
          }}
        >
          <CiEdit /> Rename
        </button>
        <button
          className={styles.button}
          onClick={() => {
            setModal("Delete");
            closeOptions();
          }}
        >
          <RiDeleteBin6Line /> Delete
        </button>
        <button
          className={styles.button}
          onClick={() => {
            setModal("Move");
            closeOptions();
          }}
        >
          <MdDriveFileMoveOutline /> Move
        </button>
      </div>
    </>
  );
};

export default ItemOptions;
