import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "./context/ClientWrapper";

export const metadata: Metadata = {
  title: "Enzo Villarama",
  description: "Me.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
