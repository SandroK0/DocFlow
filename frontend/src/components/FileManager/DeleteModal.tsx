import { useState, useEffect, useRef } from "react";
import styles from "../../styles/FileManager/New.module.css"; // Assuming you have a CSS module
import { useFileManager } from "./useFileManager";
import { Folder, Document } from "../../Types";

interface DeleteModalProps {
  item: Document | Folder;
  isFolder: boolean;
}

function DeleteModal(props: DeleteModalProps) {
  const [show, setShow] = useState<boolean>(false);
  const { item, isFolder } = props;
  const { handleDeleteDocument, handleDeleteFolder } = useFileManager();

  const modalRef = useRef<HTMLDivElement | null>(null);

  const { name, is_empty } = isFolder
    ? (item as Folder)
    : { name: (item as Document).title, is_empty: true };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show]);

  return (
    <>
      <button onClick={() => setShow(true)}>Delete</button>
      {show && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            zIndex: 11,
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            top: 0,
            left: 0,
          }}
        >
          <div className={styles.container} ref={modalRef}>
            <>
              <h3>
                Are you sure you want to delete{" "}
                {isFolder ? "folder" : "document"}: {name}{" "}
                {isFolder && !is_empty && "(folder is not empty)"}
              </h3>
              <div
                className={styles.option}
                onClick={() => {
                  if (isFolder) {
                    handleDeleteFolder((item as Folder).id);
                  } else {
                    handleDeleteDocument((item as Document).id);
                  }
                  setShow(false);
                }}
              >
                Yes
              </div>
              <div className={styles.option} onClick={() => setShow(false)}>
                No
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteModal;
