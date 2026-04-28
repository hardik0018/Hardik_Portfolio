import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hardik Vatukiya - MERN Stack Developer",
  metadataBase: new URL("https://hardikvatukiya.vercel.app"),
  description:
    "Aspiring MERN Stack Developer passionate about building full-stack web applications and creative digital solutions.",
  openGraph: {
    title: "Hardik Vatukiya - MERN Stack Developer",
    description:
      "Aspiring MERN Stack Developer passionate about building full-stack web applications and creative digital solutions.",
    url: "https://hardikvatukiya.vercel.app",
    siteName: "Hardik Vatukiya",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hardik Vatukiya - MERN Stack Developer",
    description:
      "Aspiring MERN Stack Developer passionate about building full-stack web applications and creative digital solutions.",
    images: ["/hero.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        sans.variable,
        display.variable,
        mono.variable,
        serif.variable,
      )}
    >
      <body className="min-h-screen bg-background antialiased">
        <SmoothScroll>
          <Nav />
          {children}
          <CustomCursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
