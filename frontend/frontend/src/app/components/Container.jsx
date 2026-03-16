import React from 'react';

export default function Container({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
