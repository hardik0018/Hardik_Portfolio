import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://hardikvatukiya.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: "Hardik Vatukiya — Full-Stack Developer",
  description:
    "MERN Stack Developer from Rajkot, India. Building seamless, accessible digital solutions at the intersection of performance, design, and engineering.",
  keywords: ["Hardik Vatukiya", "Full-Stack Developer", "MERN Stack", "React", "Next.js", "Node.js", "Portfolio"],
  authors: [{ name: "Hardik Vatukiya" }],
  openGraph: {
    title: "Hardik Vatukiya — Full-Stack Developer",
    description: "MERN Stack Developer from Rajkot, India. Open to work.",
    url: "https://hardikvatukiya.vercel.app",
    siteName: "Hardik Vatukiya",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hardik Vatukiya — Full-Stack Developer",
    description: "MERN Stack Developer from Rajkot, India. Open to work.",
  },
};

import SmoothScroll from "@/components/SmoothScroll";
import { WebVitals } from "@/components/WebVitals";
import HeroHeader from "@/components/Header";
import { SanityLive } from "@/lib/sanity.live";
import { getNavigation } from "@/lib/sanity.loader";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = await getNavigation();

  return (
    <html
      lang="en"
      className={`${shadowsIntoLight.variable} ${marcellus.variable} ${fraunces.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://hardikvatukiya.vercel.app/#person",
                  "name": "Hardik Vatukiya",
                  "jobTitle": "Full-Stack Developer",
                  "url": "https://hardikvatukiya.vercel.app",
                  "sameAs": [
                    "https://github.com/hardikvatukiya",
                    "https://linkedin.com/in/hardikvatukiya"
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Rajkot",
                    "addressRegion": "Gujarat",
                    "addressCountry": "IN"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://hardikvatukiya.vercel.app/#website",
                  "url": "https://hardikvatukiya.vercel.app",
                  "name": "Hardik Vatukiya — Full-Stack Developer",
                  "publisher": {
                    "@id": "https://hardikvatukiya.vercel.app/#person"
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_800px_at_100%_200px,#d5e5ff10,transparent)]"></div>

        <WebVitals />
        <SmoothScroll>
          <HeroHeader initialData={navigation} />
          {children}
        </SmoothScroll>
        <SanityLive refreshOnFocus={false} refreshOnReconnect={false} refreshOnMount={false} />
      </body>
    </html>
  );
}
