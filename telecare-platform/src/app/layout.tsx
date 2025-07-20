import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jusur (جسور)",
  description:
    "Jusur (جسور) is a humanitarian platform connecting UK medical specialists with frontline clinicians in Gaza to provide life-saving guidance. Bridging knowledge where physical aid cannot reach.",
  keywords: [
    "jusur",
    "gaza",
    "healthcare",
    "volunteer",
    "doctor",
    "surgeon",
    "remote consultation",
    "medical aid",
    "humanitarian",
    "telecare",
    "bridges",
  ],
  authors: [{ name: "Jusur Platform Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Jusur (جسور) - Bridging Medical Knowledge to Gaza",
    description:
      "When physical aid can't get in, expertise is the most powerful resource. Join UK specialists providing life-saving guidance to clinicians in Gaza.",
    type: "website",
    locale: "en_GB",
    alternateLocale: "ar",
    images: [
      {
        url: "https://placehold.co/1200x630/2e7d32/FFFFFF?text=Jusur",
        width: 1200,
        height: 630,
        alt: "Jusur Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jusur (جسور) - Bridging Medical Knowledge to Gaza",
    description:
      "When physical aid can't get in, expertise is the most powerful resource. Join UK specialists providing life-saving guidance to clinicians in Gaza.",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Jusur",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0066CC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
      </head>
      <body className="font-sans antialiased">
        {/* Future AuthProvider will wrap children here */}
        <div id="__next">{children}</div>

        {/* PWA Components */}
        <div id="pwa-components">
          {/* These will be imported dynamically in production */}
        </div>
      </body>
    </html>
  );
}
