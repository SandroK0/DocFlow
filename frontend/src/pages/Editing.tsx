import { useParams } from "react-router";
import Editor from "../components/Editor";
import { useEffect, useState } from "react";
import { Document } from "../Types";
import styles from "../styles/Editing.module.css";
import {
  getDocument,
  getSharedDocument,
  updateDocument,
  updateSharedDocument,
} from "../api/apiService";
import { Bounce, toast, ToastContainer } from "react-toastify";
import ShareDocumentModal from "../components/ShareDocumentModal";
import ReactDOM from "react-dom";

type Role = "viewer" | "editor" | "owner";



const CustomToast = ({ title, message }: { title: string; message: string }) => (
  <div>
    <strong style={{ fontSize: "16px" }}>{title}</strong>
    <div style={{ marginTop: "4px", fontSize: "14px", color: "#FFF" }}>
      {message}
    </div>
  </div>
);


export default function Editing() {
  const { docId, share_token } = useParams<{
    docId: string;
    share_token: string;
  }>();
  const [prevDocumentState, setPrevDocumentState] = useState<Document | null>(
    null
  );
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [toastMsg, setToastMsg] = useState<any>(null);
  const [role, setRole] = useState<Role>("viewer");
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  useEffect(() => {
    if (toastMsg) {
      if (toastMsg.title && toastMsg.message) {
        toast(<CustomToast title={toastMsg.title} message={toastMsg.message} />, {
          onClose: () => setToastMsg(null),
        });
      } else {
        toast(toastMsg, {
          onClose: () => setToastMsg(null),
        });
      }
    }
  }, [toastMsg, setToastMsg]);



  async function handleSave() {
    if (share_token) {
      try {
        await updateSharedDocument(
          share_token,
          currentDocument?.title,
          currentDocument?.content
        );
        setPrevDocumentState(currentDocument);
      } catch (error: any) {
        setToastMsg({
          title: "Error while saving document",
          message: error.response.data.message
        });

      }
    } else {
      try {
        if (currentDocument) {
          await updateDocument(
            currentDocument.id,
            currentDocument.title,
            currentDocument.content,
            currentDocument.folder_id
          );
          setPrevDocumentState(currentDocument);
        }
      } catch (err: any) {
        setToastMsg({
          title: "Error while saving document",
          message: err.response.data.message
        });
      }
    }
  }

  function handleChange(newValue: string) {
    if (currentDocument) {
      setCurrentDocument({ ...currentDocument, content: newValue });
    }
  }

  async function handleGetDocument() {
    try {
      const document = await getDocument(Number(docId));
      setCurrentDocument(document);
      setPrevDocumentState(document);
    } catch (err) {
      console.log("Error while getting document.", err);
    }
  }

  function handleInpChange(newTitle: string) {
    if (currentDocument) {
      setCurrentDocument({ ...currentDocument, title: newTitle });
    }
  }

  async function viewSharedDocument(share_token: string) {
    try {
      const data = await getSharedDocument(share_token);
      console.log(data);
      setRole(data.role);
      setCurrentDocument(data.document);
      setPrevDocumentState(data.document);
    } catch (err) {
      console.log("Error while getting document.", err);
    }
  }


  const printPDF = () => {
    if (currentDocument) {

      // Create a new window and write the content into it
      const printWindow = window.open("", "_blank");


      if (printWindow) {
        printWindow.document.title = currentDocument.title || "Default Document Name";
        printWindow.document.write(`${currentDocument?.content}`);

        // Close the document to trigger rendering
        printWindow.document.close();

        // Trigger the print dialog
        printWindow.print();

        // Optionally close the window after printing
        printWindow.close();
      }
    }
  };

  useEffect(() => {
    if (share_token) {
      viewSharedDocument(share_token);
    } else {
      handleGetDocument();
      setRole("owner");
    }
  }, []);

  if (!currentDocument) {
    return;
  }

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
        theme="dark"
        transition={Bounce}
        style={{ fontFamily: "monospace" }}
      />
      <div className={styles.Editing}>
        <input
          value={currentDocument?.title}
          className={styles.title}
          onChange={(e) => handleInpChange(e.target.value)}
          disabled={role === "viewer" ? true : false}
        />
        <div className={styles.rightButtons}>
          {role === "owner" && (
            <button
              onClick={() => setShowShareModal(true)}
              style={{ right: "100px" }}
              disabled={share_token ? true : false}
            >
              Share
            </button>
          )}
          <button
            onClick={printPDF}
          >
            Export PDF
          </button>

          <button
            onClick={handleSave}
            disabled={prevDocumentState === currentDocument}
          >
            Save
          </button>
        </div>
        {currentDocument && (
          <Editor
            value={currentDocument.content}
            handleChange={handleChange}
            readOnly={!["editor", "owner"].includes(role)}
          ></Editor>
        )}
      </div>

      {showShareModal &&
        ReactDOM.createPortal(
          <ShareDocumentModal
            closeModal={() => setShowShareModal(false)}
            document={currentDocument}
          />,
          document.body
        )}
    </>
  );
}
