import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SirLewis Hospital - Your Health, Our Priority",
  description: "Experience world-class healthcare with our comprehensive hospital management system. Book appointments, manage medical records, and connect with expert doctors.",
  keywords: "hospital, healthcare, medical, appointments, doctors, patients, SirLewis, Hamilton",
  authors: [{ name: "SirLewis & Hamilton Healthcare" }],
  creator: "SirLewis & Hamilton Healthcare",
  publisher: "SirLewis & Hamilton Healthcare",
  manifest: "/manifest.json",
  themeColor: "#c084fc",
  colorScheme: "light",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logos/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/logos/logo-icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/logos/logo-icon.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: '/images/logos/logo-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: "SirLewis Hospital - Your Health, Our Priority",
    description: "Experience world-class healthcare with our comprehensive hospital management system.",
    url: "https://sirlewishospital.com",
    siteName: "SirLewis Hospital",
    type: "website",
    images: [
      {
        url: "/images/logos/logo.png",
        width: 1200,
        height: 630,
        alt: "SirLewis Hospital Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SirLewis Hospital - Your Health, Our Priority",
    description: "Experience world-class healthcare with our comprehensive hospital management system.",
    images: ["/images/logos/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
