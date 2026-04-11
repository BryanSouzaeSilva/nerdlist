import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ConditionalNavbar from "./components/ConditionalNavbar";
import AuthProvider from "./components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NerdList | O seu cofre de cultura pop",
  description: "Gerencie e avalie seus filmes, séries, animes, mangás e jogos favoritos em um só lugar.",
  openGraph: {
    title: "NerdList | O seu cofre de cultura pop",
    description: "Gerencie e avalie seus filmes, séries, animes, mangás e jogos favoritos em um só lugar.",
    url: "https://nerdlist.vercel.app",
    siteName: "NerdList",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NerdList | O seu cofre de cultura pop",
    description: "Gerencie e avalie seus filmes, séries, animes, mangás e jogos favoritos em um só lugar.",
  },
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-gray-100`}>
        <AuthProvider>
          <ConditionalNavbar>
            <Navbar/>
          </ConditionalNavbar>
          <main className="pt-20">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}