import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProviderStore from "@/service/store/ProviderStore";
// import SessionProviderClient from "@/components/auth/AuthFormsProps";
import { InstallPWA } from "@/components/InstallPWA";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import ClientProviders from "@/components/ClientProviders";

// TODO metadata
export const metadata = {
  title: "endura - make your backend without coding",
  description:
    " endura is a no-code backend platform that allows you to create and manage your backend services without writing any code. It provides a user-friendly interface to design APIs, manage databases, and deploy your applications effortlessly.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="NextPWA" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProviderStore>
            <ClientProviders>
              <Header />
              <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {children}
              </main>
              <Footer />
              <InstallPWA />
            </ClientProviders>
          </ProviderStore>
        </ThemeProvider>
      </body>
    </html>
  );
}
