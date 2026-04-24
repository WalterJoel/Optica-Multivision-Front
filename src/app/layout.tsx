"use client";

import "./css/euclid-circular-a-font.css";
import "./css/style.css";
import { SessionProvider } from "next-auth/react";
import { NotifyProvider } from "@/providers/NotifyProvider";

function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <NotifyProvider>{children}</NotifyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
