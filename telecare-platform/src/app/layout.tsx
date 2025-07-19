import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title:
    "Telecare Platform for Gaza - Connecting UK Doctors with Gaza Clinicians",
  description:
    "Bridge the healthcare gap by connecting verified UK medical specialists with clinicians in Gaza for life-saving remote consultations.",
  keywords: [
    "telecare",
    "telemedicine",
    "Gaza",
    "healthcare",
    "medical consultation",
    "UK doctors",
  ],
  authors: [{ name: "Telecare Platform Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Telecare Platform for Gaza",
    description: "Connecting UK medical specialists with Gaza clinicians",
    type: "website",
    locale: "en_GB",
    alternateLocale: "ar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telecare Platform for Gaza",
    description: "Connecting UK medical specialists with Gaza clinicians",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Telecare Gaza",
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
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/icon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon-16x16.png"
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
