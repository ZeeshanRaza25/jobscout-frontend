import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "JobScout — Autonomous CV → Job Match Agent",
  description:
    "Drop a CV. JobScout extracts your profile, plans tailored searches, runs them against the live web, and scores every result with explainable reasoning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative bg-background text-foreground">
        <ClerkProvider>
          <div className="relative z-10 flex-1 flex flex-col">
            <Nav />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
