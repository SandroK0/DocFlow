import { useState, useEffect, useRef } from "react";
import styles from "../../styles/FileManager/New.module.css"; // Assuming you have a CSS module
import { useFileManager } from "./useFileManager";
import { Folder, Document } from "../../Types";

function NewModal() {
  const [show, setShow] = useState<boolean>(false); // To control modal visibility
  const [selectedOption, setSelectedOption] = useState<
    "Document" | "Folder" | null
  >(null); // Track user choice
  const [inputValue, setInputValue] = useState<string>(""); // Track input value
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string>("");

  const reset = () => {
    setSelectedOption(null);
    setInputValue("");
    setError("");
  };

  const { handleCreateDocument, handleCreateFolder, currentContent } =
    useFileManager();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShow(false);
        reset();
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
      reset();
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

  const handleOptionSelect = (option: "Document" | "Folder") => {
    setSelectedOption(option);
  };

  const FolderNameAlrExists = (name: string): boolean => {
    if (!currentContent?.folders) {
      return false;
    }

    return currentContent.folders.some(
      (folder: Folder) => folder.name === name
    );
  };

  const DocumentTitleAlrExists = (title: string): boolean => {
    if (!currentContent?.folders) {
      return false;
    }

    return currentContent.documents.some(
      (document: Document) => document.title === title
    );
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      switch (selectedOption) {
        case "Document":
          if (DocumentTitleAlrExists(inputValue)) {
            setError(
              "Document with that title already exists in current folder."
            );
            break;
          }
          handleCreateDocument(inputValue);
          setShow(false);
          reset();

          break;
        case "Folder":
          if (FolderNameAlrExists(inputValue)) {
            setError("Folder with that name already exists in current folder.");
            break;
          }
          handleCreateFolder(inputValue);
          setShow(false);
          setShow(false);
          reset();
          break;
        default:
          break;
      }
    }
  };

  return (
    <>
      <button onClick={() => setShow(true)}>New</button>
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
            {!selectedOption ? (
              <>
                <h3>Choose an Option</h3>
                <div
                  className={styles.option}
                  onClick={() => handleOptionSelect("Document")}
                >
                  Document
                </div>
                <div
                  className={styles.option}
                  onClick={() => handleOptionSelect("Folder")}
                >
                  Folder
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3>Create a {selectedOption}</h3>
                  <input
                    type="text"
                    placeholder={`Enter ${selectedOption} name`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={styles.input}
                  />
                  <button
                    onClick={handleSubmit}
                    className={styles.submitButton}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      reset();
                    }}
                    className={styles.backButton}
                  >
                    Back
                  </button>
                </div>
                <li style={{ color: "red" }}>{error}</li>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default NewModal;
