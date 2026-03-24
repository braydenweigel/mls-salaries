import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";


export default function NavigationBar(){

    return (
        <NavigationMenu viewport={false} className="hidden md:inline top-0 left-0 pl-4 pt-2">
            <NavigationMenuList>
            <NavigationMenuItem>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                    Home
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/players" className={navigationMenuTriggerStyle()}>
                    Players
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/clubs" className={navigationMenuTriggerStyle()}>
                    Clubs
                </Link>
            </NavigationMenuItem>
            {/* {<NavigationMenuItem>
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
            </NavigationMenuItem>} */}
            </NavigationMenuList>
        </NavigationMenu>
    )
}