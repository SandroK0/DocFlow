import { useFileManager } from "./useFileManager";
import Actions from "./Actions";
import ItemList from "./ItemList";
import Storage from "./Storage";
import Path from "./Path";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function FileManager() {
  const { folderHistory, goBack, handlePathClick, toastMsg, setToastMsg } =
    useFileManager();
  const [view, setView] = useState<"Grid" | "List">("List");

  useEffect(() => {
    if (toastMsg) {
      toast(toastMsg, {
        onClose: () => setToastMsg(null),
      });
    }
  }, [toastMsg]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "80%",
      }}
    >
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
      <Actions
        onGoBack={goBack}
        disableGoBack={folderHistory.length === 0}
        view={view}
        setView={setView}
      />
      <Path folderHistory={folderHistory} handlePathClick={handlePathClick} />
      <ItemList view={view} setView={setView} />
      <Storage></Storage>

    </div>
  );
}
