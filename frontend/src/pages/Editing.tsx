import { useParams } from "react-router";
import Editor from "../components/Editor";
import { useEffect, useState } from "react";
import { Document } from "../Types";
import styles from "../styles/Editing.module.css";
import { getDocument, updateDocument } from "../services/apiService";

export default function Editing() {
  const { docId } = useParams<{ docId: string }>();
  const [document, setDocument] = useState<Document | null>(null);

  async function handleSave() {
    try {
      if (document) {
        await updateDocument(document)
        console.log("Document Saved")
      }
    } catch (err) {
      console.log("Error while saving document.", err)
    }
  }

  function handleChange(newValue: string) {
    if (document) {
      setDocument({ ...document, content: newValue });
    }
  }

  async function handleGetDocument() {
    try {
      const document = await getDocument(Number(docId))
      setDocument(document)
    } catch (err) {
      console.log("Error while getting document.", err)
    }
  }

  useEffect(() => {
    handleGetDocument();
  }, []);

  return (
    <div className={styles.Editing}>
      <div className={styles.header}>
        <h1>Editing</h1>
        <button onClick={handleSave}>Save</button>
      </div>
      <main>
        {document && (
          <Editor value={document.content} handleChange={handleChange}></Editor>
        )}
      </main>
    </div>
  );
}
