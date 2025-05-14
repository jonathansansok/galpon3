//frontend\src\app\layout.tsx
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainLayoutComponent from "@/components/layouts/MainLayoutComponent";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Galpón 3 Taller",
  description: "Sistema de gestión integral de reparaciones",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <MainLayoutComponent {...props} />
        </body>
      </UserProvider>
    </html>
  );
}