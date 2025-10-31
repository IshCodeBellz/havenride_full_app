import "./globals.css";
import NavBar from "@/components/NavBar";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const isAuthenticated = !!userId;

  return (
    <html lang="en">
      <body className="w-full bg-white">
        <ClerkProvider>
          {!isAuthenticated && <NavBar />}
          <main
            className={`w-full min-h-screen ${
              !isAuthenticated ? "flex justify-center" : ""
            }`}
          >
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
