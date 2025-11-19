import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "@/styles/global.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BeautyLine Professional - Corsi di Estetica e Formazione",
    template: "%s | BeautyLine Professional",
  },
  description: "BeautyLine Professional offre corsi di alta formazione nel settore dell'estetica, con percorsi professionali e master per diventare esperti del settore.",
  keywords: ["corsi estetica", "formazione estetica", "master estetica", "beautyline", "corsi professionali"],
  authors: [{ name: "BeautyLine Professional" }],
  icons: {
    icon: "/images/logo-bl.png",
    shortcut: "/images/logo-bl.png",
    apple: "/images/logo-bl.png",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://www.beautylineprofessional.com",
    siteName: "BeautyLine Professional",
    title: "BeautyLine Professional - Corsi di Estetica e Formazione",
    description: "Corsi di alta formazione nel settore dell'estetica professionale",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${raleway.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
