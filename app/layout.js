import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";
import OnboardingGuard from "./OnboardingGuard";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ReleaseDock — Beautiful changelogs your users will actually read",
  description:
    "Create, publish, and embed changelogs in minutes. A rich editor, an embeddable widget, and a public changelog page — everything you need to keep users in the loop.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <OnboardingGuard>
              {children}
            </OnboardingGuard>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
