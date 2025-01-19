import { AiOutlineHome } from "react-icons/ai"; // Importing home icon
import { RiArrowDropRightLine } from "react-icons/ri";
import styles from "../../styles/FileManager/Path.module.css";
import { useFileManager } from "./useFileManager";
import { useDrop } from "react-dnd";
import { Document, Folder } from "../../Types";
import { useEffect, useRef, useState } from "react";
import { DiVim } from "react-icons/di";

const ItemType = {
  FOLDER: "folder",
  DOCUMENT: "document",
};

interface PathProps {
  folderHistory: Folder[];
  handlePathClick: (folder_id: number) => void;
}

interface DraggedItem {
  item: Folder | Document;
  type: string;
}

interface DroppableNodeProps {
  node: Folder | null;
  children: React.ReactNode;
}

const DroppableNode: React.FC<DroppableNodeProps> = ({ node, children }) => {
  const { handleMoveDocument, handleMoveFolder } = useFileManager();

  const [{ isOver }, drop] = useDrop({
    accept: [ItemType.FOLDER, ItemType.DOCUMENT],
    drop: (draggedItem: DraggedItem) => {
      if (draggedItem.type === ItemType.DOCUMENT) {
        handleMoveDocument(draggedItem.item as Document, node);
      } else if (draggedItem.type === ItemType.FOLDER) {
        handleMoveFolder(draggedItem.item as Folder, node);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} style={{ opacity: isOver ? 0.5 : 1 }}>
      {children}
    </div>
  );
};

export default function Path(props: PathProps) {
  const { folderHistory, handlePathClick } = props;
  const [hide, setHide] = useState<boolean>(false)
  const contRef = useRef<HTMLElement | null>(null);

  // console.log("Parent Width", contRef.current?.offsetWidth)
  // console.log("Child Width", contRef.current?.)

  useEffect(() => {

    if (contRef.current) {

      let parrentWidth = contRef.current.offsetWidth
      console.log("Parent Width:", parrentWidth);
      let innerWidth = 0
      const childElements = Array.from(contRef.current.children); // Get child elements
      childElements.forEach((child) => {
        const childElement = child as HTMLElement; // Cast to HTMLElement
        innerWidth += childElement.offsetWidth
        // console.log(`Child ${index + 1} Width:`, childElement.offsetWidth);
      });
      console.log("innerContentWidth:", innerWidth)

      if (innerWidth > parrentWidth) {
        setHide(true)
      }
    }
  }, [folderHistory])

  return (
    <nav className={styles.Path} aria-label="Breadcrumb" ref={contRef}>
      {
        <DroppableNode node={null}>
          <div
            className={`${styles.Breadcrumb} ${folderHistory.length === 0 ? styles.ActiveCrumb : styles.Crumb
              }`}
            onClick={() => handlePathClick(-1)}
            role="button"
            tabIndex={0}
            aria-label="Navigate to home"
          >
            <AiOutlineHome size={20} />
          </div>
        </DroppableNode>
      }

      <div className={styles.pathCont}>
        {folderHistory.map((node: Folder, index: number) =>

        (
          <DroppableNode node={node} key={node.id}>
            <div className={styles.Breadcrumb}>
              {index >= 0 && "/"}
              <span
                className={
                  index === folderHistory.length - 1
                    ? styles.ActiveCrumb
                    : styles.Crumb
                }
                onClick={() =>
                  index !== folderHistory.length - 1 && handlePathClick(node.id)
                }
                role="button"
                tabIndex={0}
                aria-label={`Navigate to ${node.name}`}
              >
                {node.name}
              </span>
            </div>
          </DroppableNode>
        )
        )}
      </div>
    </nav>
  );
}
