// app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatPDF",
  description: "Chat with your PDF documents using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#41B3A2",
        },
        elements: {
          formButtonPrimary: "bg-[#41B3A2] hover:bg-[#41B3A2]/90",
        }
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            
            <main className="flex flex-col min-h-screen">
              {children}
            </main>
            <Toaster position="bottom-right" />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}