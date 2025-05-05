//frontend\src\components\layouts\MainLayoutComponent.tsx
"use client";
import AuthProvider from "./AuthProvider";
import AppContentLayoutComponent from "./AppContentLayoutComponent";

interface MainLayoutComponentProps {
  children?: React.ReactNode;
}

export default function MainLayoutComponent(props: MainLayoutComponentProps) {
  return (
    <AuthProvider>
      <AppContentLayoutComponent {...props} />
    </AuthProvider>
  );
}