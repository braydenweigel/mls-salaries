import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { ModeToggle } from "./mode-toggle";
import { SearchButton } from "./Search";

export default function NavigationBar(){

    return (
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