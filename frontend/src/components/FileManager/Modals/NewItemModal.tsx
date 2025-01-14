import { useState } from "react";
import styles from "../../../styles/FileManager/New.module.css"; // Assuming you have a CSS module
import { useFileManager } from "../useFileManager";
import { Folder, Document } from "../../../Types";
import ModalContWrapper from "../../ModalContWrapper";

function NewItemModal({ closeModal }: { closeModal: () => void }) {
  const [selectedOption, setSelectedOption] = useState<
    "Document" | "Folder" | null
  >(null); // Track user choice
  const [inputValue, setInputValue] = useState<string>(""); // Track input value
  const [error, setError] = useState<string>("");

  const reset = () => {
    setSelectedOption(null);
    setInputValue("");
    setError("");
  };

  const { handleCreateDocument, handleCreateFolder, currentContent } =
    useFileManager();

  const handleOptionSelect = (option: "Document" | "Folder") => {
    setSelectedOption(option);
  };

  const FolderNameAlrExists = (name: string): boolean => {
    if (!currentContent?.folders) {
      return false;
    }

    return currentContent.folders.some(
      (folder: Folder) => folder.name === name,
    );
  };

  const DocumentTitleAlrExists = (title: string): boolean => {
    if (!currentContent?.folders) {
      return false;
    }

    return currentContent.documents.some(
      (document: Document) => document.title === title,
    );
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      switch (selectedOption) {
        case "Document":
          if (DocumentTitleAlrExists(inputValue)) {
            setError(
              "Document with that title already exists in current folder.",
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
          break;
      }
    }
  };

  return (
    <ModalContWrapper closeModal={closeModal}>
      <div className={styles.container}>
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
              <button onClick={handleSubmit} className={styles.submitButton}>
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
    </ModalContWrapper>
  );
}

export default NewItemModal;
