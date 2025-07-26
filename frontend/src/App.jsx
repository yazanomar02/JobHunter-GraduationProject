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
            background: '#141a2f',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
