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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/lib/mode-toggle";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "@/lib/store/store";
import { useEffect } from "react";
import { fetchPlayers } from "@/lib/store/playersSlice";
import { fetchClubs } from "@/lib/store/clubsSlice";
import { fetchRecords } from "@/lib/store/recordsSlice";
import { fetchPlayerRecords } from "@/lib/store/playerRecordsSlice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


function InitData() {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(fetchPlayers())
    dispatch(fetchClubs())
    dispatch(fetchPlayerRecords())
  }), [dispatch]

  return null
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <NavigationMenu viewport={false} className=" top-0 left-0 pl-4 pt-2">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/players">Players</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/clubs">Clubs</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={navigationMenuTriggerStyle()}
                    >
                      Compare
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href="/players/compare">Players</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/clubs/compare">Clubs</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="fixed right-0 top-0 pr-2 pt-2"><ModeToggle/></div>
          </header>
          <main className="min-h-screen mt-12 mx-auto w-full max-w-[90%] lg:max-w-[66%] px-4">
            <Provider store={store}>
              <InitData/>
              {children}
            </Provider>
          </main>
          <footer className="bottom-0 mx-auto w-full max-w-[90%] lg:max-w-[66%] px-4 py-2">
            <p className="text-muted-foreground text-center">Built by <a href="https://github.com/braydenweigel" target="_blank" className="inline-block"><u>Brayden Weigel</u> &nbsp;<SiGithub className="inline-block"/></a></p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
