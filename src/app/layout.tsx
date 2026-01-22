import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://docket.one'),
  title: {
    default: "Docket One - Calculators That Actually Matter",
    template: "%s | Docket One"
  },
  description: "Discover fun, practical calculators for modern life! From caffeine half-life to zombie apocalypse survival.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docket.one',
    siteName: 'Docket One',
    title: 'Docket One - Premium Calculators',
    description: 'Smart, fun, and practical calculators for modern life.',
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
  verification: {
    google: 'verification_token', // User to replace later
  },
};

import { BackgroundBlobs } from "@/components/atoms/background-blobs";
import { CookieConsent } from "@/components/molecules/cookie-consent";
import { Footer } from "@/components/organisms/footer";
import { NavBar } from "@/components/organisms/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans min-h-screen flex flex-col relative`}
      >
        <BackgroundBlobs />
        <div className="fixed inset-0 -z-30 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        <NavBar />
        <div className="flex-1 flex flex-col relative z-0">
          {children}
        </div>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
