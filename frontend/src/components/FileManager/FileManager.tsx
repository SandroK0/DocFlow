import { useFileManager } from "./useFileManager";
import Actions from "./Actions";
import ItemList from "./ItemList";
import Storage from "./Storage";
import Path from "./Path";
import { useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function FileManager() {
  const { folderHistory, goBack, handlePathClick, toastMsg, setToastMsg } =
    useFileManager();

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
      />
      <Path folderHistory={folderHistory} handlePathClick={handlePathClick} />
      <ItemList />
      <Storage></Storage>

    </div>
  );
}
