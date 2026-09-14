import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link"
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
          <header className="relative flex w-full shrink-0 items-start bg-background bg-opacity-100 z-50">
            <NavigationSideBar/>
            <NavigationBar/>
            <div className="absolute right-0 top-0 pr-2 pt-2 pb-2 flex items-center gap-2">
              <SearchButton/>
              <ModeToggle/>
          </div>
          </header>
          <main className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex h-full flex-col mx-auto w-full max-w-[96%] lg:max-w-[66%] px-4 pt-4">
              <Suspense fallback={<LoadingPlayerPage/>}>
                {children}
              </Suspense>
            </div>
          </main>
          <footer className="shrink-0 flex justify-center items-center mx-auto w-full max-w-[96%] md:max-w-[66%] px-4 py-2 text-center text-xs md:text-base">
            <div><Link href="/players/list" className="hover:underline">All Players List</Link> • <Link href="/clubs/list" className="hover:underline">All Clubs List</Link></div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
