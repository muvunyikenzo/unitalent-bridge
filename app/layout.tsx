import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'UniTalent Bridge',
  description: 'Find student services and talent at your university.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}