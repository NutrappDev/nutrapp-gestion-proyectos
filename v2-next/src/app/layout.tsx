'use client';

import { Mulish } from 'next/font/google';
import { Suspense, useEffect, useState } from 'react';
import './globals.css';
import AuthProviderClient from '../auth/AuthProviderClient';

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-mulish',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <html lang="es">
        <body className={`${mulish.variable} antialiased transition-all duration-200`}>
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body
        className={`${mulish.variable} antialiased transition-all duration-200`}
        suppressHydrationWarning
      >
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>}>
          <AuthProviderClient>
            {children}
          </AuthProviderClient>
        </Suspense>
      </body>
    </html>
  );
}