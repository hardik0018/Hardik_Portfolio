import type { Metadata, Viewport } from "next";
import { Shadows_Into_Light, Marcellus, Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows-into-light",
  subsets: ["latin"],
  display: "swap",
  weight: "400"
})

const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  display: "swap",
  weight: "400"
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#008f51",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hardikvatukiya.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Hardik Vatukiya — Full-Stack Developer | MERN Stack & React Engineer",
    template: "%s | Hardik Vatukiya — Full-Stack Developer",
  },
  description:
    "Hardik Vatukiya is a Full-Stack Developer from Rajkot, India specializing in React, Next.js, and Node.js. Building fast, accessible, and visually stunning web applications. Available for freelance & contract work worldwide. Explore case studies, projects, and insights on modern web development.",
  keywords: [
    "Hardik Vatukiya",
    "Full-Stack Developer",
    "MERN Stack",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript Developer",
    "Portfolio",
    "hire Hardik Vatukiya",
    "Hardik Vatukiya portfolio",
    "MERN Stack Developer India",
    "Full-Stack Developer Rajkot",
    "React Next.js freelancer",
    "hire React developer",
    "freelance web developer India",
    "GSAP animation developer",
    "Sanity CMS developer",
    "web developer Rajkot Gujarat",
    "hire freelance React developer in India",
    "expert MERN stack developer",
    "Next.js performance optimization expert",
    "Custom web application development services",
    "React developer for contract work"
  ],
  authors: [{ name: "Hardik Vatukiya", url: "https://hardikvatukiya.vercel.app" }],
  creator: "Hardik Vatukiya",
  publisher: "Hardik Vatukiya",
  openGraph: {
    title: "Hardik Vatukiya — Full-Stack Developer | React & Next.js Engineer",
    description: "Hardik Vatukiya is a Full-Stack Developer from Rajkot, India specializing in React, Next.js, and Node.js. Available for freelance & contract work worldwide.",
    url: "https://hardikvatukiya.vercel.app",
    siteName: "Hardik Vatukiya",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hardik Vatukiya — Full-Stack Developer specializing in React, Next.js and Node.js",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hardik Vatukiya — Full-Stack Developer",
    description: "Full-Stack Developer from Rajkot, India. React, Next.js, Node.js. Available for freelance work.",
    creator: "@hardikvatukiya",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import SmoothScroll from "@/components/SmoothScroll";
import { WebVitals } from "@/components/WebVitals";
import HeroHeader from "@/components/Header";
import TransitionProvider from "@/components/TransitionProvider";
import MainLoader from "@/components/MainLoader";
import { SanityLive } from "@/lib/sanity.live";
import { getNavigation } from "@/lib/sanity.loader";
import { GoogleAnalytics } from "@/components/google-analytics";
import { draftMode } from "next/headers";
import JsonLd from "@/components/JsonLd";
import { getPersonSchema, getWebsiteSchema } from "@/lib/schema";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = await getNavigation();
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang="en"
      className={`${shadowsIntoLight.variable} ${marcellus.variable} ${fraunces.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && (
          <>
            <link
              rel="preconnect"
              href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io`}
              crossOrigin="anonymous"
            />
            <link
              rel="preconnect"
              href="https://cdn.sanity.io"
              crossOrigin="anonymous"
            />
            <meta name="google-site-verification" content="0qUCCjAYs5J-EAndlqTyH9iBe4NWV6a_FL3zUU7G6z0" />
          </>
        )}
        <JsonLd
          schema={{
            "@context": "https://schema.org",
            "@graph": [getPersonSchema(), getWebsiteSchema()],
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_800px_at_100%_200px,#d5e5ff10,transparent)]"></div>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />

        <WebVitals />
        <SmoothScroll>
          <TransitionProvider>
            <MainLoader />
            <HeroHeader initialData={navigation} />
            {children}
          </TransitionProvider>
        </SmoothScroll>
        {isDraftMode && (
          <SanityLive refreshOnFocus={false} refreshOnReconnect={false} refreshOnMount={false} />
        )}
      </body>
    </html>
  );
}
