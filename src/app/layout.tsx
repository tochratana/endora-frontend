import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import ProviderStore from "@/service/store/ProviderStore";
// import SessionProviderClient from "@/components/auth/AuthFormsProps";
import { InstallPWA } from "@/components/InstallPWA";
import Shell from "@/components/layouts/Shell";
import { ThemeProvider } from "@/components/theme-provider";
import ClientProviders from "@/components/ClientProviders";

// TODO metadata
export const metadata = {
  title: "Endora - Backend Made Simple | Instant APIs, Auth, and Database",
  description:
    "Transform your ideas into powerful backend services in minutes. Endora provides instant RESTful APIs, authentication, real-time databases, and storage solutions - all without writing a single line of code.",
  keywords: [
    "backend as a service",
    "instant api",
    "no-code backend",
    "api platform",
    "database management",
    "authentication service",
    "serverless platform",
    "real-time database",
  ],
  icons: {
    icon: "/EndoraTransparent.png",
    shortcut: "/EndoraTransparent.png",
    apple: "/EndoraTransparent.png",
  },
};

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

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
        {/* <link rel="apple-touch-icon" href="/icon-192x192.png" /> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProviderStore>
            <ClientProviders>
              <Shell>{children}</Shell>
            </ClientProviders>
          </ProviderStore>
        </ThemeProvider>
      </body>
    </html>
  );
}
