import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Fraunces } from 'next/font/google';
import PagesWrapper from "@/components/PagesWrapper";
import SmoothScrolling from "@/components/SmoothScrolling";

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hardikvatukiya.vercel.app";
const siteName = "Hardik Vatukiya | Creative Developer";
const siteDescription = "Creative Developer & MERN Stack Engineer based in Ahmedabad, India. Specialized in building premium digital experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#06060A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PagesWrapper>
      <SmoothScrolling>{children}</SmoothScrolling>
    </PagesWrapper>
  );
}
