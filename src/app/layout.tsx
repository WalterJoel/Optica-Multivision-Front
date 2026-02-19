import "./css/euclid-circular-a-font.css";
import "./css/style.css";
import AuthGate from "../components/Auth/AuthGate";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
