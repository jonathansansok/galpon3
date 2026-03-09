//frontend\src\components\layouts\MainLayoutComponent.tsx
"use client";
import AuthProvider from "./AuthProvider";
import AppContentLayoutComponent from "./AppContentLayoutComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MainLayoutComponentProps {
  children?: React.ReactNode;
}

export default function MainLayoutComponent(props: MainLayoutComponentProps) {
  return (
    <AuthProvider>
      <AppContentLayoutComponent {...props} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
}