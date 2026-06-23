import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces, Hanken_Grotesk, Space_Mono, Bungee, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Almanac (category pages) typography
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Arcade theme display + pixel faces
const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
});

const pressStart = Press_Start_2P({
  variable: "--font-press",
  subsets: ["latin"],
  weight: "400",
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
  alternates: {
    canonical: 'https://docket.one/',
  },
  other: {
    'google-adsense-account': 'ca-pub-7016949439291956',
    'json-ld': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Docket One',
      'url': 'https://docket.one',
      'description': 'Premium calculators for modern life. Smart, fun, and practical tools.',
      'applicationCategory': 'EducationalApplication, BusinessApplication',
      'operatingSystem': 'Any',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    })
  }
};

import { NavigationProgress } from "@/components/atoms/navigation-progress";
import Script from "next/script";
import { ConsentScripts } from "@/components/molecules/consent-scripts";
import { CookieConsent } from "@/components/molecules/cookie-consent";
import { Footer } from "@/components/organisms/footer";
import { NavBar } from "@/components/organisms/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              'name': 'Docket One',
              'url': 'https://docket.one',
              'description': 'Premium calculators for modern life. Smart, fun, and practical tools.',
              'applicationCategory': 'EducationalApplication, BusinessApplication',
              'operatingSystem': 'Any',
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'USD'
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${hankenGrotesk.variable} ${spaceMono.variable} ${bungee.variable} ${pressStart.variable} antialiased bg-background text-foreground font-sans min-h-screen flex flex-col relative`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`}
        </Script>
        <NavigationProgress />
        <ConsentScripts />

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
