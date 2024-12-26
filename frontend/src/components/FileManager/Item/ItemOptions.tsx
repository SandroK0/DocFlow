import React, { useState } from "react";
import ReactDOM from "react-dom";
import DeleteItemModal from "../Modals/DeleteItemModal";
import MoveItemModal from "../Modals/MoveItemModal";
import { Folder, Document } from "../../../Types";

interface ItemOptionsProps {
  item: Folder | Document;
  isFolder: boolean;
  renaming: boolean;
  setRenaming: (value: boolean) => void;
  rnInputValue: string;
  setRnInputValue: (value: string) => void;
  handleRenameFolder: (id: number, newName: string) => void;
  handleRenameDocument: (id: number, newName: string) => void;
  indx: number;
  showOptions: number | null;
  setShowOptions: (index: number | null) => void;
}

const ItemOptions: React.FC<ItemOptionsProps> = ({
  item,
  isFolder,
  renaming,
  setRenaming,
  rnInputValue,
  setRnInputValue,
  handleRenameFolder,
  handleRenameDocument,
  indx,
  showOptions,
  setShowOptions,
}) => {
  const [modal, setModal] = useState<"Delete" | "Move" | null>(null);

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
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
                        : (item as Document).title
                    );
                    setRenaming(true);
                  }}
                >
                  Rename
                </button>
                <button onClick={() => setModal("Delete")}>Delete</button>
                <button onClick={() => setModal("Move")}>Move</button>
              </>
            )}
            <button
              onClick={() => setShowOptions(indx === showOptions ? null : indx)}
            >
              ...
            </button>
          </>
        )}
      </div>
      {modal === "Delete" &&
        ReactDOM.createPortal(
          <DeleteItemModal
            item={item}
            isFolder={isFolder}
            closeModal={() => setModal(null)}
          />,
          document.body
        )}
      {modal === "Move" &&
        ReactDOM.createPortal(
          <MoveItemModal
            item={item}
            isFolder={isFolder}
            closeModal={() => setModal(null)}
          />,
          document.body
        )}
    </>
  );
};

export default ItemOptions;
