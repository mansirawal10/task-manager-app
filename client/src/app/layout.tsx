import "./globals.css";
import { Suspense } from "react";
import LayoutWrapper from "../components/layoutWrapper"; // Adjust the path as needed

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body className="antialiased bg-gray-50 text-gray-900">
        <Suspense fallback={<p>Loading...</p>}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Suspense>

        </body>

      </html>
    );
  }
  

