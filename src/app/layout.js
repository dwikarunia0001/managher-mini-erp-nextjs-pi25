'use client'
import "./globals.css";

import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/'; // hanya di landing page

  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          {!hideSidebar && <Sidebar />}
          <div className={`flex-1 ${!hideSidebar ? 'lg:ml-64' : ''}`}>
            <Header />
            <main className="p-4 lg:p-6 pt-20 lg:pt-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}