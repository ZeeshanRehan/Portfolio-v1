import type { Metadata } from "next";
import { Cormorant, Abel } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const abel = Abel({
  variable: "--font-abel",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Zeshan Rehan",
  description: "Full Stack Developer based in New Jersey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${abel.variable}`}
    >
      <body>
        {children}
        <Analytics/>
        </body>
    </html>
  );
}