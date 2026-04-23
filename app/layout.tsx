import type { Metadata } from "next";
import { Inter, Roboto_Slab, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import { cn } from "@/lib/utils";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500"] });
const display = Roboto_Slab({ subsets: ["latin"], variable: "--font-display", weight: ["700", "900"] });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400"] });

export const metadata: Metadata = {
  title: "Hardik Vatukiya — Designer & Developer",
  description: "Navigating the unknown, pixel by pixel. Portfolio of Hardik Vatukiya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("dark", sans.variable, display.variable, mono.variable)}>
      <body>
        <Nav />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
