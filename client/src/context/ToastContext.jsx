import { createContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

const ToastProvider = (props) => {
  const addToast = (message, type) => {
    return new Promise((resolve) => {
      toast[type](message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: resolve,
      });
    });
  };

  const values = {
    addToast,
  };

  return <ToastContext.Provider value={values} {...props} />;
};

export { ToastProvider, ToastContext };
