import Link from "next/link"
import clubs from "@/lib/data/clubs.json"
import type { Club } from "@/lib/data/types"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "All Clubs List - MLS Salaries"
}

export default function ClubsList(){
    const allClubs = clubs as Club[]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-2">
            {allClubs.map((club) => (
                <Link key={club.clubid} href={`/clubs/${club.clubid}`} className="hover:underline py-1" prefetch={false}>{club.clubname}</Link>
            ))}
        </div>
    )
}