import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import ConditionalNavbar from "./components/ConditionalNavbar";
import AuthProvider from "./components/SessionProvider";
import { Toaster } from "sonner";
import MobileHeader from "./components/MobileHeader";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-gray-100`}>
        <AuthProvider>
          <ConditionalNavbar>
            <div className="hidden md:block">
              <Navbar/>
            </div>
            <div className="md:hidden">
              <MobileHeader />
            </div>
            <div className="md:hidden">
              <MobileNav />
            </div>
          </ConditionalNavbar>
          <main className="pt-20 pb-20 md:pb-0">
            {children}
            <Toaster theme="dark" position="bottom-right" richColors closeButton />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}