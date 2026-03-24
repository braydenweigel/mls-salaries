"use client"

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";


export default function NavigationSideBar(){
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
       <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><Button variant="outline" onClick={() => setOpen(true)} className="md:hidden ml-2 mt-2"><Menu/>Menu</Button></SheetTrigger>
        <SheetContent side="left" className=" w-[45%]">
            <SheetHeader><SheetTitle>mlssalaries.fyi</SheetTitle></SheetHeader>
            <div className="ml-4 -mt-4 flex flex-col gap-1">
                <Link href="/">Home</Link>
                <Link href="/players">Players</Link>
                <Link href="/clubs">Clubs</Link>
            </div>
        </SheetContent>
       </Sheet>
    )
}