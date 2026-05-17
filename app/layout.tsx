import type { Metadata } from 'next';
import { Roboto_Flex, Manrope } from "next/font/google";
import './globals.css';
import GlobalDotBackground from '@/components/GlobalDotBackground';

const displayFont = Roboto_Flex({
  subsets: ["latin"],
  // Variable font: keep a wide weight range for the TextPressure effect.
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'Smart Pantry',
  description: 'AI-first pantry discovery, recipe matching, and cooking guidance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <GlobalDotBackground />
        <div className="app-content-layer">
          {children}
        </div>
      </body>
    </html>
  );
}
