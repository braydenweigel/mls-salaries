"use client"

import Link from "next/link";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ArrowLeftRight, ChevronDownIcon, ChevronUpIcon, DollarSign, Home, Menu, Monitor, Moon, Shield, Sun, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Home },
    { href: "/players", label: "Players", icon: Users },
    { href: "/clubs", label: "Clubs", icon: Shield },
]

const THEME_OPTIONS = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
]

const navItemClass = (active: boolean) => cn(
    "flex items-center gap-3 rounded-md px-2 py-2 text-sm",
    active ? "bg-muted font-semibold" : "hover:bg-muted/50"
)

export default function NavigationSideBar(){
    const [open, setOpen] = useState(false)
    const [cOpen, setCOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    useEffect(() => {
        setCOpen(false)
    }, [open])

    const isCompareActive = pathname.startsWith("/players/compare") || pathname.startsWith("/clubs/compare")

    return (
       <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><Button variant="outline" size="icon" onClick={() => setOpen(true)} className="md:hidden" aria-label="Open menu"><Menu/></Button></SheetTrigger>
        <SheetContent side="left" className="w-[85%] gap-0 sm:max-w-xs">
            <SheetHeader className="border-b">
                <SheetTitle className="flex items-center gap-2.5">
                    <span className="inline-flex size-7.5 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <DollarSign className="size-4.25" aria-hidden="true"/>
                    </span>
                    mlssalaries.fyi
                </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4 pt-3">
                <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">Browse</p>
                {NAV_ITEMS.map((item) => {
                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                    return (
                        <Link key={item.href} href={item.href} className={navItemClass(active)}>
                            <item.icon className="size-4.5"/>
                            {item.label}
                        </Link>
                    )
                })}
                <Collapsible open={cOpen} onOpenChange={setCOpen}>
                    <CollapsibleTrigger asChild>
                        <button className={cn(navItemClass(isCompareActive), "w-full")}>
                            <ArrowLeftRight className="size-4.5"/>
                            <span className="flex-1 text-left">Compare</span>
                            {cOpen ? <ChevronUpIcon className="size-4"/> : <ChevronDownIcon className="size-4"/>}
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-5 flex flex-col gap-1 border-l pl-4 pt-1">
                        <Link href="/players/compare" className="rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">Compare players</Link>
                        <Link href="/clubs/compare" className="rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">Compare clubs</Link>
                    </CollapsibleContent>
                </Collapsible>
                <div className="my-2 border-t"/>
                <Link href="/players/list" className={navItemClass(false)}>All Players List</Link>
                <Link href="/clubs/list" className={navItemClass(false)}>All Clubs List</Link>
            </div>
            <SheetFooter className="mt-auto border-t">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                        {THEME_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                aria-label={option.label}
                                onClick={() => setTheme(option.value)}
                                className={cn(
                                    "flex size-7 items-center justify-center rounded-sm",
                                    mounted && theme === option.value ? "bg-background shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                <option.icon className="size-4"/>
                            </button>
                        ))}
                    </div>
                </div>
            </SheetFooter>
        </SheetContent>
       </Sheet>
    )
}
