import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import styles from "../styles/FileManager.module.css";
import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { Document } from "../Types";

export default function FileManager() {
  const [currentContent, setCurrentContent] = useState<any>();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const navigate = useNavigate();

  const navigateToEdit = (docId: number) => {
    navigate(`/workspace/editing/${docId}`);
  };

  const goToFolder = (folderId: number) => {
    setCurrentFolderId(folderId);
  };

  const createFolder = (folderName: string, currentFolderId: number | null) => {
    const token = localStorage.getItem("jwt"); // Fetch the JWT token from localStorage

    if (!token) {
      console.error("No JWT token found");
      return;
    }

    axios
      .post(
        `${API_URL}/folders/`,
        {
          name: folderName,
          ...(currentFolderId ? { parent_id: currentFolderId } : {}), // Conditionally add parent_id if currentFolderId exists
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Folder created successfully:", response.data);
        // Optionally, you can add logic here to update UI or state with the created folder
      })
      .catch((error) => {
        console.error(
          "Error creating folder:",
          error.response?.data || error.message
        );
        // Handle error more effectively, show user-friendly message if needed
      });
  };
  useEffect(() => {
    axios
      .get(`${API_URL}/folders/${currentFolderId ? currentFolderId : "root"}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((resp) => {
        setCurrentContent(resp.data);
      });
  }, [currentFolderId, createFolder]);

  return (
    <div>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={() => createFolder(inputValue, currentFolderId)}>
          Create Folder
        </button>
      </div>
      <div className={styles.container}>
        {currentContent &&
          currentContent.folders.map((folder: any) => (
            <div className={styles.item} onClick={() => goToFolder(folder.id)}>
              <FaFolder /> {folder.name}
            </div>
          ))}
        {currentContent &&
          currentContent.documents.map((document: Document) => (
            <div
              key={document.id}
              className={styles.item}
              onClick={() => navigateToEdit(document.id)}
            >
              <IoDocumentTextOutline /> {document.title}
            </div>
          ))}
      </div>
    </div>
  );
}
