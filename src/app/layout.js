import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <div className="flex flex-col flex-1 lg:ml-64">
            <Header />
            <main className="p-4 lg:p-6 pt-4 lg:pt-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}