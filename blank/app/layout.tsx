import type { Metadata } from "next";
import "./globals.css";
import ClientWrapper from "./context/ClientWrapper";

export const metadata: Metadata = {
  title: {
    default: "Enzo Villarama | Creative Technologist",
    template: "%s | Enzo Villarama"
  },
  description: "Creative technologist exploring digital systems, identity, and self-directed work. Based in Auckland, New Zealand. Currently building project: BLANK.",
  keywords: [
    "Enzo Villarama",
    "creative technologist",
    "digital systems",
    "web developer",
    "Auckland",
    "New Zealand",
    "project BLANK",
    "design engineer"
  ],
  authors: [{ name: "Enzo Villarama", url: "https://enzovillarama.com" }],
  creator: "Enzo Villarama",
  
  metadataBase: new URL("https://enzovillarama.com"),
  
  alternates: {
    canonical: "/"
  },
  
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://enzovillarama.com",
    title: "Enzo Villarama | Creative Technologist",
    description: "Creative technologist exploring digital systems, identity, and self-directed work. Based in Auckland, New Zealand.",
    siteName: "Enzo Villarama",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Enzo Villarama - Creative Technologist',
      }
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Enzo Villarama | Creative Technologist",
    description: "Creative technologist exploring digital systems, identity, and self-directed work.",
    images: ['/og-image.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(240, 100%, 99%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(0, 0%, 10%)' },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Enzo Villarama",
              jobTitle: "Creative Technologist",
              description: "Creative technologist exploring digital systems, identity, and self-directed work",
              url: "https://enzovillarama.com",
              email: "ienzovillarama@gmail.com",
              sameAs: [
                "https://www.instagram.com/___e_vil",
                "https://www.linkedin.com/in/enzo-villarama",
                "https://github.com/VillaramaEnzo",
                "https://linktr.ee/___e_vil"
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Auckland",
                addressCountry: "NZ"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
