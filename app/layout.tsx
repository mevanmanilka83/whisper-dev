import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "./components/auth-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "WHISPER",
  description: "Whisper Dev Application",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">
                      © {new Date().getFullYear()} Whisper. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Privacy
                      </a>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Terms
                      </a>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
