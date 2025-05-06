// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to the Task Management System
      </h1>
      <p className="mb-6 text-lg">
        Organize. Assign. Track. Get things done together.
      </p>

      <div className="space-x-4">
        <Link href="/login">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Register
          </button>
        </Link>
      </div>
    </main>
  );
}