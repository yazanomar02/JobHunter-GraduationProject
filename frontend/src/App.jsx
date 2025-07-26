import { Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AllRoutes from "./Routes/AllRoutes";
import useUpdateUserData from "./hooks/useUpdateUserData";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FeedbackChat from "./components/Common/FeedbackChat";
import { Toaster } from "react-hot-toast";

function App() {
  const { status, userData } = useSelector((store) => store.auth);

  const location = useLocation();
  const hideOnRoutes = ["/login", "/signup"];
  const updateUser = useUpdateUserData();

  useEffect(() => {
    updateUser();
  }, []);

  return (
    <>
      <div className="font-Poppins">
        {!(
          location.pathname.startsWith("/dashboard") ||
          hideOnRoutes.includes(location.pathname)
        ) && <Navbar />}
        <AllRoutes />
        <FeedbackChat />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#141a2f",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#141a2f",
          },
        }}
      />
    </>
  );
}

export default App;
