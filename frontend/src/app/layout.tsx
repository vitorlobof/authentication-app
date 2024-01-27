import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopBar from "@/components/navigation/TopBar";
import Container from "@/components/Container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de autenticação",
  description: "Página inicial do sistema de autenticação.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopBar />
        <Container>
          {children}
        </Container>
      </body>
    </html>
  );
}
