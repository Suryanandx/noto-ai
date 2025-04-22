import type React from "react"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

// Import our environment configuration
import { logEnvironmentStatus } from "@/lib/env"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Define base URL for canonical links and absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://noto-ai.suryanand.com"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | NOTO AI by Suryanand",
    default: "NOTO AI - Smart Notes Powered by AI | Suryanand",
  },
  description:
    "AI-powered note-taking app that helps you organize your thoughts, extract insights, and boost productivity with Grok AI integration.",
  keywords: ["note-taking", "AI", "productivity", "Grok", "organization", "Suryanand", "notes app", "smart notes"],
  authors: [{ name: "Suryanand", url: "https://suryanand.com" }],
  creator: "Suryanand",
  publisher: "Suryanand",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "NOTO AI",
    title: "NOTO AI - Smart Notes Powered by AI",
    description:
      "AI-powered note-taking app that helps you organize your thoughts, extract insights, and boost productivity with Grok AI integration.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "NOTO AI - Smart Notes Powered by AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOTO AI - Smart Notes Powered by AI",
    description:
      "AI-powered note-taking app that helps you organize your thoughts, extract insights, and boost productivity with Grok AI integration.",
    creator: "@suryanand",
    images: [`${baseUrl}/twitter-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: `${baseUrl}/manifest.json`,
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-US": `${baseUrl}/en-US`,
    },
  },
  category: "productivity",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will log the environment variable status during development
  if (process.env.NODE_ENV === "development") {
    logEnvironmentStatus()
  }

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "NOTO AI",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Suryanand",
                url: "https://suryanand.com",
              },
              description:
                "AI-powered note-taking app that helps you organize your thoughts, extract insights, and boost productivity with Grok AI integration.",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
