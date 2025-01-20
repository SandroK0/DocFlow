import { useFileManager } from "./useFileManager";
import Actions from "./Actions";
import ItemList from "./ItemList";
import Storage from "./Storage";
import Path from "./Path";
import { useEffect } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure you include Toastify styles

const CustomToast = ({ title, message }: { title: string; message: string }) => (
  <div>
    <strong style={{ fontSize: "16px" }}>{title}</strong>
    <div style={{ marginTop: "4px", fontSize: "14px", color: "#FFF" }}>
      {message}
    </div>
  </div>
);

export default function FileManager() {
  const { folderHistory, goBack, handlePathClick, toastMsg, setToastMsg } =
    useFileManager();

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
        theme="dark"
        transition={Bounce}
      />
      <Actions onGoBack={goBack} disableGoBack={folderHistory.length === 0} />
      <Path folderHistory={folderHistory} handlePathClick={handlePathClick} />
      <ItemList />
      <Storage />
    </div>
  );
}


