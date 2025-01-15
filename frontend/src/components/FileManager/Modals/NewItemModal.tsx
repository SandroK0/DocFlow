import { useState } from "react";
import styles from "../../../styles/FileManager/New.module.css"; // Assuming you have a CSS module
import { useFileManager } from "../useFileManager";
import { Folder, Document } from "../../../Types";
import ModalContWrapper from "../../ModalContWrapper";

function NewItemModal({ closeModal }: { closeModal: () => void }) {
  const [selectedOption, setSelectedOption] = useState<"Document" | "Folder">(
    "Document"
  ); // Track user choice
  const [inputValue, setInputValue] = useState<string>(""); // Track input value
  const [error, setError] = useState<string>("");

  const reset = () => {
    setInputValue("");
    setError("");
  };

  const { handleCreateDocument, handleCreateFolder, currentContent } =
    useFileManager();

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
          closeModal();
          reset();
          break;
        case "Folder":
          if (FolderNameAlrExists(inputValue)) {
            setError("Folder with that name already exists in current folder.");
            break;
          }
          handleCreateFolder(inputValue);
          closeModal();
          reset();
          break;
        default:
          setError("Please select a type.");
          break;
      }
    } else {
      setError("Please enter a name.");
    }
  };

  return (
    <ModalContWrapper closeModal={closeModal}>
      <div className={styles.container}>
        <h3>Create a new item</h3>

        <div className={styles.selectionContainer}>
          <button
            className={selectedOption === "Document" ? styles.active : ""}
            onClick={() => setSelectedOption("Document")}
          >
            Document
          </button>
          <button
            className={selectedOption === "Folder" ? styles.active : ""}
            onClick={() => setSelectedOption("Folder")}
          >
            Folder
          </button>
        </div>

        <>
          <input
            type="text"
            placeholder={`Enter ${selectedOption} name`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.input}
          />
          <p style={{ color: "red" }}>{error}</p>
        </>

        {/* Action Buttons */}
        <div className={styles.btnCont}>
          <button onClick={handleSubmit} className={styles.button}>
            Create
          </button>
          <button
            onClick={() => {
              reset();
              closeModal();
            }}
            className={styles.button}
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalContWrapper>
  );
}

export default NewItemModal;
