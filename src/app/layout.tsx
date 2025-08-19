import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Internet Pulse",
  description: "Real-time worldwide internet traffic monitoring, outages, and censorship tracking",
  keywords: "internet monitoring, global traffic, network outages, censorship, real-time data",
  authors: [{ name: "Global Internet Pulse Team" }],
  openGraph: {
    title: "Global Internet Pulse",
    description: "Real-time worldwide internet monitoring dashboard",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen`}
        suppressHydrationWarning={true}
      >
        <div className="min-h-screen relative">
          {/* Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <main className="pt-16">
            {children}
          </main>
          
          {/* Background decorative elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </body>
    </html>
  );
}
