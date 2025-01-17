import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/FileManager/ItemList.module.css";
import { Folder, Document } from "../../../Types";
import { useFileManager } from "../useFileManager";
import ItemIcon from "./ItemIcon";
import ItemName, { ItemNameRef } from "./ItemName";
import ItemDragDropWrapper from "./ItemDragDropWrapper";
import { SlOptionsVertical } from "react-icons/sl";
import ItemOptions from "./ItemOptions";
import { CiEdit } from "react-icons/ci";
import DeleteItemModal from "../Modals/DeleteItemModal";
import MoveItemModal from "../Modals/MoveItemModal";
import { MdDriveFileMoveOutline } from "react-icons/md";

interface ItemProps {
  item: Folder | Document;
  isFolder: boolean;
  indx: number;
  showOptions: ItemOptions | null;
  setShowOptions: (options: ItemOptions | null) => void;
  selectItemToggle: () => void;
  isSelected: boolean;
}

interface ItemOptions {
  indx: number;
  position: { left: number; top: number };
}

const Item: React.FC<ItemProps> = ({
  item,
  isFolder,
  indx,
  setShowOptions,
  showOptions,
  selectItemToggle,
  isSelected,
}) => {
  const navigate = useNavigate();
  const {
    goToFolder,
    handleMoveDocument,
    handleMoveFolder,
    handleRenameFolder,
    handleRenameDocument,
    selectedItems,
    setSelectedItems,
  } = useFileManager();

  const childRef = useRef<ItemNameRef>(null);

  const [renaming, setRenaming] = useState<boolean>(false);
  const [rnInputValue, setRnInputValue] = useState<string>("");
  const [showOpts, setShowOpts] = useState<boolean>(false);
  const [modal, setModal] = useState<"Delete" | "Move" | null>(null);

  const navigateToEdit = (docId: number) =>
    navigate(`/workspace/editing/${docId}`);

  const handleOptionsClick = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    setShowOptions(
      indx === showOptions?.indx
        ? null
        : { indx: indx, position: { left: e.pageX, top: e.pageY } }
    );
  };

  const submitName = () => {
    if (isFolder) {
      handleRenameFolder(item.id, rnInputValue);
    } else {
      handleRenameDocument(item.id, rnInputValue);
    }
    setRenaming(false);
  };

  const handleRenameClick = () => {
    setRnInputValue(
      isFolder ? (item as Folder).name : (item as Document).title
    );
    setRenaming(true);
    setTimeout(() => {
      childRef.current?.focusInput();
    }, 0);
  };

  console.log(item);
  return (
    <>
      <ItemDragDropWrapper
        item={item}
        isFolder={isFolder}
        handleMoveDocument={handleMoveDocument}
        handleMoveFolder={handleMoveFolder}
      >
        <div
          style={
            isSelected ? { backgroundColor: "rgba(0, 123, 255, 0.3)" } : {}
          }
          className={styles.item}
          onDoubleClick={() =>
            isFolder ? goToFolder(item as Folder) : navigateToEdit(item.id)
          }
          onClick={selectItemToggle}
          onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            handleOptionsClick(e);
          }}
          onMouseEnter={() => setShowOpts(true)}
          onMouseLeave={() => setShowOpts(false)}
        >
          <div className={styles.itemLeft}>
            <ItemIcon isFolder={isFolder} />
            <ItemName
              ref={childRef}
              item={item}
              isFolder={isFolder}
              renaming={renaming}
              rnInputValue={rnInputValue}
              setRnInputValue={setRnInputValue}
            />
          </div>
          {renaming ? (
            <div
              className={styles.itemRight}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.button} onClick={submitName}>
                done
              </button>
              <button
                className={styles.button}
                onClick={() => setRenaming(false)}
              >
                cancel
              </button>
            </div>
          ) : (
            <div
              className={`${styles.itemRight}`}
              onClick={(e) => e.stopPropagation()}
            >
              {showOpts && (
                <>
                  {" "}
                  <button
                    style={{
                      all: "unset",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setModal("Move");
                    }}
                  >
                    <MdDriveFileMoveOutline />
                  </button>
                  <button
                    style={{
                      all: "unset",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setSelectedItems([]);
                      handleRenameClick();
                    }}
                  >
                    <CiEdit />
                  </button>{" "}
                </>
              )}

              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  setSelectedItems([]);
                  handleOptionsClick(e);
                }}
                className={styles.optBtn}
              >
                <SlOptionsVertical />
              </button>
            </div>
          )}
        </div>
      </ItemDragDropWrapper>
      {showOptions &&
        showOptions.indx === indx &&
        ReactDOM.createPortal(
          <ItemOptions
            handleRenameClick={handleRenameClick}
            handleRenameFolder={handleRenameFolder}
            handleRenameDocument={handleRenameDocument}
            position={showOptions?.position}
            closeOptions={() => setShowOptions(null)}
            setModal={setModal}
          />,
          document.body
        )}
      {modal === "Delete" &&
        ReactDOM.createPortal(
          <DeleteItemModal
            items={selectedItems.length > 0 ? selectedItems : [item]}
            closeModal={() => setModal(null)}
          />,
          document.body
        )}
      {modal === "Move" &&
        ReactDOM.createPortal(
          <MoveItemModal
            items={selectedItems.length > 0 ? selectedItems : [item]}
            closeModal={() => setModal(null)}
          />,
          document.body
        )}
    </>
  );
};

export default Item;
