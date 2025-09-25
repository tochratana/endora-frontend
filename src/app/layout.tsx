import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import ProviderStore from "@/service/store/ProviderStore";
import Shell from "@/components/layouts/Shell";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ClientProviders from "@/components/ui/ClientProviders";

// Metadata
export const metadata = {
  title: "Endora - Backend Made Simple | Instant APIs, Auth, and Database",
  description:
    "Transform your ideas into powerful backend services in minutes. Endora provides instant RESTful APIs, authentication, real-time databases, and storage solutions - all without writing a single line of code.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
};

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap", // 👈 ensures consistent className across SSR/CSR
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Endora" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} antialiased`}
        suppressHydrationWarning // 👈 ensure mismatch doesn’t crash hydration
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // 👈 FIX: avoid system mismatch, can toggle later
          enableSystem={false} // 👈 disable SSR theme flicker
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
