import React, { ReactNode } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Folder, Document } from "../../../Types";

const ItemType = {
  FOLDER: "folder",
  DOCUMENT: "document",
};

interface ItemDragDropWrapperProps {
  item: Folder | Document; // Represents the item being wrapped.
  isFolder: boolean; // True if the item is a folder, false if it's a document.
  handleMoveDocument: (
    documentToMove: Document,
    folderToMoveTo: Folder
  ) => void;
  handleMoveFolder: (folderToMove: Folder, folderToMoveTo: Folder) => void;
  children: ReactNode; // React children to render inside this wrapper.
}

// Define the drag item type for type safety
interface DraggedItem {
  item: Folder | Document; // The actual item being dragged.
  type: string; // "folder" or "document".
}

const ItemDragDropWrapper: React.FC<ItemDragDropWrapperProps> = ({
  item,
  isFolder,
  handleMoveDocument,
  handleMoveFolder,
  children,
}) => {
  // useDrag hook for draggable behavior
  const [{ isDragging }, drag] = useDrag<
    DraggedItem,
    void,
    { isDragging: boolean }
  >(() => ({
    type: isFolder ? ItemType.FOLDER : ItemType.DOCUMENT, // Type for DnD
    item: () => {
      // Log the item being dragged
      console.log("Dragging item:", item);
      return { item, type: isFolder ? ItemType.FOLDER : ItemType.DOCUMENT };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // useDrop hook for droppable behavior
  const [, drop] = useDrop<DraggedItem>({
    accept: [ItemType.FOLDER, ItemType.DOCUMENT], // Accept folders and documents
    drop: (draggedItem: DraggedItem) => {
      if (draggedItem.type === ItemType.DOCUMENT) {
        handleMoveDocument(draggedItem.item as Document, item as Folder);
        console.log(
          "Dropped document:",
          (draggedItem.item as Document).id,
          "into folder:",
          (item as Folder).id
        );
      } else if (
        draggedItem.type === ItemType.FOLDER &&
        (draggedItem.item as Folder).id !== (item as Folder).id
      ) {
        handleMoveFolder(draggedItem.item as Folder, item as Folder);
        console.log(
          "Dropped folder:",
          (draggedItem.item as Folder).id,
          "into folder:",
          (item as Folder).id
        );
      }
    },
    canDrop: () => isFolder, // Only folders can be drop targets
  });

  return (
    <div
      ref={(node) => drag(drop(node))} // Combine drag and drop refs
      style={{ opacity: isDragging ? 0.5 : 1 }} // Style for dragging
    >
      {children}
    </div>
  );
};

export default ItemDragDropWrapper;
