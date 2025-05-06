// src/components/LayoutWrapper.tsx
'use client'; // This makes sure the component runs on the client

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Define the routes where you DO NOT want to display Navbar and Sidebar.
  const hideLayoutPaths = ['/', '/login', '/register'];

  // If the current route is in this list, return only the children.
  if (hideLayoutPaths.includes(pathname)) {
    return <>{children}</>;
  }

  // Otherwise, render the Navbar and Sidebar around the children.
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  );
}