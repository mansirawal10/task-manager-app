import "./globals.css";
import { Suspense } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body className="antialiased bg-gray-50 text-gray-900">
        <Suspense>{children}</Suspense>
        </body>
      </html>
    );
  }
  

