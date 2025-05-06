import "./globals.css";
import LayoutWrapper from '../components/layoutWrapper';
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body className="antialiased bg-gray-50 text-gray-900">
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </html>
    );
  }
  

