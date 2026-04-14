"use client"

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ChevronDownIcon, ChevronUpIcon, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";


export default function NavigationSideBar(){
    const [open, setOpen] = useState(false)
    const [cOpen, setCOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    useEffect(() => {
        setCOpen(false)
    }, [open])

    return (
       <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><Button variant="outline" onClick={() => setOpen(true)} className="md:hidden ml-2 mt-2"><Menu/>Menu</Button></SheetTrigger>
        <SheetContent side="left" className=" w-[45%]">
            <SheetHeader><SheetTitle>mlssalaries.fyi</SheetTitle></SheetHeader>
            <div className="ml-4 -mt-4 flex flex-col gap-1">
                <Link href="/">Home</Link>
                <Link href="/players">Players</Link>
                <Link href="/clubs">Clubs</Link>
                <Collapsible open={cOpen}>
                    <CollapsibleTrigger asChild>
                            <div className="flex items-center -mt-1">
                                <p>Compare</p>
                                <Button variant="ghost" size="icon-sm" onClick={() => setCOpen(!cOpen)}>{cOpen ? <ChevronUpIcon/> : <ChevronDownIcon/>}</Button>
                            </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col">
                        <Link href="/players/compare" className="ml-4">Players</Link>
                        <Link href="/clubs/compare" className="ml-4">Clubs</Link>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </SheetContent>
       </Sheet>
    )
}