import type { Metadata } from 'next';
import React from 'react';
// @ts-ignore CSS is processed by Next.js at build time.
import './globals.css';

export const metadata: Metadata = {
  title: 'Starcity - Society Management System',
  description: 'Modern, transparent, and automated housing society management portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

