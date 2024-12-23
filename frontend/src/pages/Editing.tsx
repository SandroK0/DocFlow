import { useParams } from "react-router";
import Editor from "../components/Editor";
import { useEffect, useState } from "react";
import { Document } from "../Types";
import styles from "../styles/Editing.module.css";
import { getDocument, updateDocument } from "../services/apiService";

export default function Editing() {
  const { docId } = useParams<{ docId: string }>();
  const [prevDocumentState, setPrevDocumentState] = useState<Document | null>(
    null,
  );
  const [document, setDocument] = useState<Document | null>(null);

  async function handleSave() {
    try {
      if (document) {
        await updateDocument(
          document.id,
          document.title,
          document.content,
          document.folder_id,
        );
        setPrevDocumentState(document);
      }
    } catch (err) {
      console.log("Error while saving document.", err);
    }
  }

  function handleChange(newValue: string) {
    if (document) {
      setDocument({ ...document, content: newValue });
    }
  }

  async function handleGetDocument() {
    try {
      const document = await getDocument(Number(docId));
      setDocument(document);
      setPrevDocumentState(document);
    } catch (err) {
      console.log("Error while getting document.", err);
    }
  }

  function handleInpChange(newTitle: string) {
    if (document) {
      setDocument({ ...document, title: newTitle });
    }
  }

  useEffect(() => {
    handleGetDocument();
  }, []);

  return (
    <div className={styles.Editing}>
      <div className={styles.header}>
        <input
          value={document?.title}
          onChange={(e) => handleInpChange(e.target.value)}
          style={{ fontSize: "30px", border: "None" }}
        />
        <button onClick={handleSave} disabled={prevDocumentState === document}>
          Save
        </button>
      </div>
      <main>
        {document && (
          <Editor value={document.content} handleChange={handleChange}></Editor>
        )}
      </main>
    </div>
  );
}
