import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fatoora AI | UAE VAT-Ready Invoicing",
  description: "Automated invoicing, AI expense extraction, and VAT readiness for UAE SMEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMockAuth = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('dummy');

  const content = (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-950 text-slate-50`}
      >
        {children}
      </body>
    </html>
  );

  if (isMockAuth) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
