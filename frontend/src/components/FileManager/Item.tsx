import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import styles from "../../styles/FileManager/ItemList.module.css";
import MoveModal from "./MoveModal";
import DeleteModal from "./DeleteModal";
import { Folder, Document } from "../../Types";
import { useFileManager } from "./useFileManager";

const ItemType = {
  FOLDER: "folder",
  DOCUMENT: "document",
};

interface ItemProps {
  item: Folder | Document;
  isFolder: boolean;
  indx: number;
  showOptions: number | null;
  setShowOptions: (index: number | null) => void;
}

const Item: React.FC<ItemProps> = ({
  item,
  isFolder,
  indx,
  showOptions,
  setShowOptions,
}) => {
  const navigate = useNavigate();
  const {
    goToFolder,
    handleMoveDocument,
    handleMoveFolder,
    handleRenameFolder,
    handleRenameDocument,
  } = useFileManager();
  const [renaming, setRenaming] = useState<boolean>(false);
  const [rnInputValue, setRnInputValue] = useState<string>("");
  const navigateToEdit = (docId: number) =>
    navigate(`/workspace/editing/${docId}`);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: isFolder ? ItemType.FOLDER : ItemType.DOCUMENT,
    item: { id: item.id, type: isFolder ? ItemType.FOLDER : ItemType.DOCUMENT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: [ItemType.FOLDER, ItemType.DOCUMENT],
    drop: (draggedItem: { id: number; type: string }) => {
      if (
        isFolder &&
        draggedItem.type === ItemType.DOCUMENT &&
        draggedItem.id !== item.id
      ) {
        console.log(
          `Document ${draggedItem.id} dropped into Folder ${item.id}`,
        );
        handleMoveDocument(draggedItem.id, item.id);
      } else if (
        isFolder &&
        draggedItem.type === ItemType.FOLDER &&
        draggedItem.id !== item.id
      ) {
        console.log(`Folder ${draggedItem.id} dropped into Folder ${item.id}`);
        handleMoveFolder(draggedItem.id, item.id);
      }
    },
    canDrop: (draggedItem) => isFolder,
  });

  return (
    <div ref={drop} className={styles.itemContainer}>
      <div
        ref={drag}
        className={`${styles.item} ${isDragging ? styles.dragging : ""}`}
        onClick={() =>
          isFolder
            ? goToFolder(item.id, (item as Folder).name)
            : navigateToEdit(item.id)
        }
      >
        <div>
          {isFolder ? <FaFolder /> : <IoDocumentTextOutline />}
          {isFolder ? (
            renaming ? (
              <input
                type="text"
                value={rnInputValue}
                onChange={(e) => {
                  setRnInputValue(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              (item as Folder).name
            )
          ) : renaming ? (
            <input
              type="text"
              value={rnInputValue}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                setRnInputValue(e.target.value);
              }}
            />
          ) : (
            (item as Document).title
          )}
        </div>
        <div
          className={styles.itemOptions}
          onClick={(e) => e.stopPropagation()}
        >
          {renaming ? (
            <>
              <button
                onClick={() => {
                  if (isFolder) {
                    handleRenameFolder(item.id, rnInputValue);
                  } else {
                    handleRenameDocument(item.id, rnInputValue);
                  }
                  setRenaming(false);
                }}
              >
                done
              </button>
              <button onClick={() => setRenaming(false)}>cancel</button>
            </>
          ) : (
            <>
              {showOptions === indx && (
                <>
                  <button
                    onClick={() => {
                      setRnInputValue(
                        isFolder
                          ? (item as Folder).name
                          : (item as Document).title,
                      );
                      setRenaming(true);
                    }}
                  >
                    Rename
                  </button>
                  <MoveModal item={item} isFolder={isFolder} />
                  <DeleteModal item={item} isFolder={isFolder}></DeleteModal>
                </>
              )}
              <button
                onClick={() =>
                  setShowOptions(indx === showOptions ? null : indx)
                }
              >
                options
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
