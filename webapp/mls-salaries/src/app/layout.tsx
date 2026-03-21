'use client'

import { Geist, Geist_Mono } from "next/font/google";
import { SiGithub } from "@icons-pack/react-simple-icons"
import Link from "next/link"
import "./globals.css";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
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
  const isMobile = useIsMobile()
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <header className="flex fixed w-full top-0 items-start bg-background bg-opacity-100 z-50">
            {isMobile ? <NavigationSideBar/> : <NavigationBar/>}
            <div className="fixed right-0 top-0 pr-2 pt-2 pb-2 flex items-center gap-2">
              <SearchButton/>
              <ModeToggle/>
          </div>
          </header>
          <main className="min-h-screen mt-16 mx-auto w-full max-w-[96%] lg:max-w-[66%] px-4">
            <Suspense fallback={<LoadingPlayerPage/>}>
              {children}
            </Suspense>
          </main>
          <footer className="flex justify-center bottom-0 mx-auto w-full max-w-[96%] md:max-w-[66%] px-4 py-2 text-muted-foreground text-center">
            <div><Link href="/players/list" className="hover:underline">All Players List</Link> • <Link href="/clubs/list" className="hover:underline">All Clubs List</Link> •&nbsp;</div>
            <p className="">Built by <a href="https://github.com/braydenweigel" target="_blank" className="inline-block"><u>Brayden Weigel</u> &nbsp;<SiGithub className="inline-block"/></a></p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}
