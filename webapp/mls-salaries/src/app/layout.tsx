import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link"
import { DollarSign } from "lucide-react"
import "./globals.css";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/lib/mode-toggle";
import { Suspense } from "react";
import LoadingPlayerPage from "./players/[id]/_components/loading";
import { SearchButton } from "@/components/lib/Search";
import NavigationBar from "@/components/lib/nav-bar";
import React from "react";
import NavigationSideBar from "@/components/lib/nav-sidebar";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-dvh flex flex-col overflow-hidden`}>
        <GoogleAnalytics gaId="G-5FBL2DXL5M" />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <header className="shrink-0 border-b bg-card z-50">
            <div className="mx-auto flex h-15 max-w-[96%] lg:max-w-[66%] items-center justify-between gap-4 pr-3 pl-4 md:h-16 md:px-6">
              <div className="flex items-center gap-2.5 md:gap-5">
                <Link href="/" className="flex items-center gap-2.5">
                  <span className="inline-flex size-7.5 items-center justify-center rounded-lg bg-primary text-primary-foreground md:size-8">
                    <DollarSign className="size-4.25 md:size-4.5" aria-hidden="true" />
                  </span>
                  <span className="text-base font-semibold tracking-[-0.01em] md:text-[15px]">
                    mlssalaries.fyi
                  </span>
                </Link>
                <NavigationBar/>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <SearchButton/>
                <div className="hidden md:flex"><ModeToggle/></div>
                <NavigationSideBar/>
              </div>
            </div>
          </header>
          <main className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex min-h-full flex-col">
              <div className="flex flex-1 flex-col mx-auto w-full max-w-[96%] lg:max-w-[66%] px-4 pt-4">
                <Suspense fallback={<LoadingPlayerPage/>}>
                  {children}
                </Suspense>
              </div>
              <footer className="hidden shrink-0 md:block mt-6 border-t bg-background">
                <div className="mx-auto flex w-full max-w-[96%] lg:max-w-[66%] items-center justify-end gap-4 px-4 py-4 text-xs text-muted-foreground md:px-6">
                  <Link href="/players/list" className="hover:text-foreground hover:underline">All Players List</Link>
                  <Link href="/clubs/list" className="hover:text-foreground hover:underline">All Clubs List</Link>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
