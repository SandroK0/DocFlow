import React, { ReactNode } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Folder, Document } from "../../../Types";

const ItemType = {
  FOLDER: "folder",
  DOCUMENT: "document",
};

interface ItemDragDropWrapperProps {
  item: Folder | Document;
  isFolder: boolean;
  handleMoveDocument: (docId: number, folderId: number) => void;
  handleMoveFolder: (folderId: number, targetFolderId: number) => void;
  children: ReactNode;
}

const ItemDragDropWrapper: React.FC<ItemDragDropWrapperProps> = ({
  item,
  isFolder,
  handleMoveDocument,
  handleMoveFolder,
  children,
}) => {
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
      if (draggedItem.type === ItemType.DOCUMENT) {
        handleMoveDocument(draggedItem.id, item.id);
        console.log(draggedItem.id, item.id);
      } else if (
        draggedItem.type === ItemType.FOLDER &&
        draggedItem.id !== item.id
      ) {
        handleMoveFolder(draggedItem.id, item.id);
        console.log(draggedItem.id, item.id);
      }
    },
    canDrop: () => isFolder,
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
};

export default ItemDragDropWrapper;
