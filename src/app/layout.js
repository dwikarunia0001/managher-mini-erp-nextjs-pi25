'use client';
import "./globals.css";
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar hanya muncul di halaman ERP */}
          {!isLandingPage && <Sidebar />}
          
          <div className={`flex-1 ${!isLandingPage ? 'lg:ml-64' : ''}`}>
            {/* Header hanya muncul di halaman ERP */}
            {!isLandingPage && <Header />}
            
            <main className={`${!isLandingPage ? 'p-4 lg:p-6 pt-20 lg:pt-6' : 'min-h-screen'}`}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}