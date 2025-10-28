import './globals.css';
import NavBar from '@/components/NavBar';
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <NavBar />
          <main className="min-h-screen">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
