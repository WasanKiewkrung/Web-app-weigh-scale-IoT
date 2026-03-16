import React from 'react';

export default function Footer() {
  return (
    <footer className="text-center text-gray-500 py-4 border-t mt-10 text-sm">
      © {new Date().getFullYear()} Butcher System | All rights reserved.
    </footer>
  );
}
