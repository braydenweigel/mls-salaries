"use client"

import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { cn } from "@/lib/utils";

const navLinkClass = cn(navigationMenuTriggerStyle(), "bg-transparent")

export default function NavigationBar(){

    return (
        <NavigationMenu viewport={false} className="hidden md:inline">
            <NavigationMenuList>
            <NavigationMenuItem>
                <Link href="/reports" className={navLinkClass}>
                    Reports
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/players" className={navLinkClass}>
                    Players
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/clubs" className={navLinkClass}>
                    Clubs
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger className={navLinkClass}>
                    Compare
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[160px] gap-1">
                        <li>
                            <NavigationMenuLink asChild>
                                <Link href="/players/compare">Players</Link>
                            </NavigationMenuLink>
                        </li>
                        <li>
                            <NavigationMenuLink asChild>
                                <Link href="/clubs/compare">Clubs</Link>
                            </NavigationMenuLink>
                        </li>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}