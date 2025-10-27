import type { Metadata } from "next";
import { Quicksand, Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Chadebebe - Compartilhando Amor",
  description: "Sistema de doação de enxoval de bebês do GAP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${quicksand.variable} ${openSans.variable} antialiased bg-gradient`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
