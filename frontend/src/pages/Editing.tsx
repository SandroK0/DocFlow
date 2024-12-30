import { useParams } from "react-router";
import Editor from "../components/Editor";
import { useEffect, useState } from "react";
import { Document } from "../Types";
import styles from "../styles/Editing.module.css";
import { getDocument, updateDocument } from "../services/apiService";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function Editing() {
  const { docId } = useParams<{ docId: string }>();
  const [prevDocumentState, setPrevDocumentState] = useState<Document | null>(
    null
  );
  const [document, setDocument] = useState<Document | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (toastMsg) {
      toast(toastMsg, {
        onClose: () => setToastMsg(null),
      });
    }
  }, [toastMsg]);

  async function handleSave() {
    try {
      if (document) {
        await updateDocument(
          document.id,
          document.title,
          document.content,
          document.folder_id
        );
        setPrevDocumentState(document);
      }
    } catch (err: any) {
      console.log("Error while saving document.", err.response.data.message);
      setToastMsg(`Error while saving document: ${err.response.data.message}`);
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
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        style={{ fontFamily: "monospace" }}
      />
      <div className={styles.Editing}>
        <input
          value={document?.title}
          className={styles.title}
          onChange={(e) => handleInpChange(e.target.value)}
        />
        <button
          onClick={handleSave}
          disabled={prevDocumentState === document}
          className={styles.saveBtn}
        >
          Save
        </button>
        {document && (
          <Editor
            value={document.content}
            handleChange={handleChange}
          ></Editor>
        )}
      </div>
    </>
  );
}
