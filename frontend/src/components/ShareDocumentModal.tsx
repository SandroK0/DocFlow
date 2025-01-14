import ModalContWrapper from "./ModalContWrapper";
import styles from "../styles/ShareDocumentModal.module.css";
import { Document } from "../Types"; // Ensure Document type includes 'id: number'
import { shareDocument } from "../services/apiService";
import { useState } from "react";

interface ShareDocumentModalProps {
  closeModal: () => void;
  document: Document; // Ensure Document has 'id' as a number
}

type RoleType = "viewer" | "editor";

export default function ShareDocumentModal(props: ShareDocumentModalProps) {
  const { closeModal, document } = props;
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [role, setRole] = useState<RoleType>("viewer"); // Default role
  const [copied, setCopied] = useState<boolean>(false);

  async function handleShareClick(id: number) {
    try {
      const data = await shareDocument(id, role);
      setShareLink(
        `${window.location.origin}/document/shared/${data.share_token}`
      );
      setCopied(false); // Reset copied state when new link is generated
    } catch (error) {
      console.error("Failed to share document", error);
    }
  }

  function handleCopyLink() {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
    }
  }

  return (
    <ModalContWrapper closeModal={closeModal}>
      <div className={styles.cont}>
        <h2 className={styles.header}>Share Document</h2>
        <div className={styles.roleSelector}>
          <label htmlFor="role">Select Role: </label>
          <select
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleType)} // Ensuring correct type
            className={styles.select}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {shareLink && (
          <div className={styles.shareLinkContainer}>
            <input
              type="text"
              value={shareLink}
              readOnly
              className={styles.shareLinkInput}
            />
            <button onClick={handleCopyLink} className={styles.copyButton}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        )}

        <div className={styles.actions}>
          <button
            onClick={() => handleShareClick(document.id)} // Ensure document.id is a number
            className={styles.shareButton}
          >
            Generate Link
          </button>
          <button onClick={closeModal} className={styles.doneButton}>
            Done
          </button>
        </div>
      </div>
    </ModalContWrapper>
  );
}
