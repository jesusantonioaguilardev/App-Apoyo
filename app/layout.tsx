import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { HelpButton } from "@/components/HelpButton";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "AppApoyo", template: "%s · AppApoyo" },
  description: "Acompañamiento emocional con IA: conversa por texto o voz con tu avatar.",
};

export const viewport: Viewport = {
  themeColor: "#2f7a6d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body className={`${nunito.variable} font-sans antialiased`}>
        {children}
        <HelpButton />
      </body>
    </html>
  );
}
