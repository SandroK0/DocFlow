import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "../styles/FileManager.module.css";
import { FaFolder } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Document, Folder } from "../Types";
import { fetchFolderContent, createFolder, createDocument } from "../services/apiService"; // Import API functions

interface CurrentContent {
    documents: Document[];
    folders: Folder[];
}

export default function FileManager() {
    const [currentContent, setCurrentContent] = useState<CurrentContent | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [currentFolderIdStack, setCurrentFolderIdStack] = useState<Array<number | null>>([]);
    const [currentFolderNameStack, setCurrentFolderNameStack] = useState<Array<string>>(["root"]);
    const navigate = useNavigate();

    // Peek function to get the current folder ID
    const peek = (): number | null => {
        return currentFolderIdStack.length > 0
            ? currentFolderIdStack[currentFolderIdStack.length - 1]
            : null;
    };

    const navigateToEdit = (docId: number) => {
        navigate(`/workspace/editing/${docId}`);
    };

    const goToFolder = (folderId: number, folderName: string) => {
        setCurrentFolderIdStack((prevStack) => [...prevStack, folderId]);
        setCurrentFolderNameStack((prevStack) => [...prevStack, folderName])
    };

    const goBack = () => {
        setCurrentFolderIdStack((prevStack) => {
            if (prevStack.length === 0) return prevStack; // If stack is empty, do nothing
            return prevStack.slice(0, -1); // Pop from the stack
        });
        setCurrentFolderNameStack((prevStack) => {
            if (prevStack.length === 0) return prevStack; // If stack is empty, do nothing
            return prevStack.slice(0, -1); // Pop from the stack
        });

    };

    const handleCreateFolder = async () => {
        const parent_id = peek();
        try {
            await createFolder(inputValue, parent_id); // Use service
            setCurrentFolderIdStack((prevStack) => [...prevStack]); // Trigger refetch
        } catch (err) {
            console.error("Error creating folder:", err);
        }
    };

    const handleCreateDocument = async () => {
        const folder_id = peek();
        try {
            await createDocument(inputValue, folder_id); // Use service
            setCurrentFolderIdStack((prevStack) => [...prevStack]); // Trigger refetch
        } catch (err) {
            console.error("Error creating document:", err);
        }
    };

    useEffect(() => {
        const currentFolderId = peek() ?? "root"; // Use "root" if stack is empty
        fetchFolderContent(currentFolderId) // Use service
            .then((data) => {
                setCurrentContent(data);
                console.log(data);
            })
            .catch((err) => {
                console.error("Error fetching folder content:", err);
            });
    }, [currentFolderIdStack]);

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={handleCreateFolder}>Create Folder</button>
                <button onClick={handleCreateDocument}>Create Document</button>
                <button onClick={goBack} disabled={currentFolderIdStack.length === 0}>
                    Go Back
                </button>
            </div>
            <div>{currentFolderNameStack.join("/")}</div>
            <div className={styles.container}>
                {currentContent &&
                    [...currentContent.folders, ...currentContent.documents].map((item: Folder | Document) => {
                        const isFolder = (item as Folder).name !== undefined;
                        return (
                            <div
                                key={`item-${isFolder ? (item as Folder).id : (item as Document).id}`}
                                className={styles.item}
                                onClick={() =>
                                    isFolder
                                        ? goToFolder((item as Folder).id, (item as Folder).name)
                                        : navigateToEdit((item as Document).id)
                                }
                            >
                                {isFolder ? <FaFolder /> : <IoDocumentTextOutline />}{" "}
                                {isFolder ? (item as Folder).name : (item as Document).title}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

