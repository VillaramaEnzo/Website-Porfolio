import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "@/context/ClientWrapper";
// import HeaderProvider from "@/context/HeaderProvider";
import PageTransition from '@/components/PageTransition'


export const metadata: Metadata = {
  title: "Enzo Villarama",
  description: "Welcome to my personal portfolio",
  manifest: "/manifest.json",
  icons: "/icons.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className="font-sans">
          <ClientWrapper>
            <main>
              <PageTransition />
              {children}
            </main>
          </ClientWrapper>
      </body>
    </html>
  );
}
