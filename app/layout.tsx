"use client";
import "./globals.css";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Detect if current route is under /admin
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        {/* Pass a flag to Navbar */}
        <Navbar hideLinks={isAdminPage} />

        <main>{children}</main>
      </body>
    </html>
  );
}
