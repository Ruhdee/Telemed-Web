import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { EmergencySOS } from "@/components/features/EmergencySOS";
import { Chatbot } from "@/components/features/Chatbot";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "TeleMedCare | Premium Healthcare",
  description: "Advanced AI-powered Telemedicine Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <AuthProvider>
          {children}
          <Chatbot />
          <EmergencySOS />
        </AuthProvider>
      </body>
    </html>
  );
}
