import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/FileManager/ItemList.module.css";
import { Folder, Document } from "../../../Types";
import { useFileManager } from "../useFileManager";
import ItemIcon from "./ItemIcon";
import ItemName from "./ItemName";
import ItemOptions from "./ItemOptions";
import ItemDragDropWrapper from "./ItemDragDropWrapper";

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

  return (
    <ItemDragDropWrapper
      item={item}
      isFolder={isFolder}
      handleMoveDocument={handleMoveDocument}
      handleMoveFolder={handleMoveFolder}
    >
      <div
        className={styles.itemContainer}
        onClick={() =>
          isFolder
            ? goToFolder(item.id, (item as Folder).name)
            : navigateToEdit(item.id)
        }
      >
        <div className={`${styles.item}`}>
          <div className={styles.itemLeft}>
          <ItemIcon isFolder={isFolder} />
          <ItemName
            item={item}
            isFolder={isFolder}
            renaming={renaming}
            rnInputValue={rnInputValue}
            setRnInputValue={setRnInputValue}
          />
          </div>
        <ItemOptions
          item={item}
          isFolder={isFolder}
          renaming={renaming}
          setRenaming={setRenaming}
          rnInputValue={rnInputValue}
          setRnInputValue={setRnInputValue}
          handleRenameFolder={handleRenameFolder}
          handleRenameDocument={handleRenameDocument}
          indx={indx}
          showOptions={showOptions}
          setShowOptions={setShowOptions}
        />
        </div>
      </div>
    </ItemDragDropWrapper>
  );
};

export default Item;
