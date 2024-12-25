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
  handleMoveDocument: (
    documentToMove: Document,
    folderToMoveTo: Folder,
  ) => void;
  handleMoveFolder: (folderToMove: Folder, folderToMoveTo: Folder) => void;
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
    item: { item: item, type: isFolder ? ItemType.FOLDER : ItemType.DOCUMENT },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: [ItemType.FOLDER, ItemType.DOCUMENT],
    drop: (draggedItem: { item: Document | Folder; type: string }) => {
      if (draggedItem.type === ItemType.DOCUMENT) {
        handleMoveDocument(draggedItem.item as Document, item as Folder);
        console.log(draggedItem.item.id, item.id);
      } else if (
        draggedItem.type === ItemType.FOLDER &&
        draggedItem.item.id !== item.id
      ) {
        handleMoveFolder(draggedItem.item as Folder, item as Folder);
        console.log(draggedItem.item.id, item.id);
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
