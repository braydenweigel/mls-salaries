"use client"

import { RootState } from "@/lib/store/store"
import Link from "next/link"
import { useSelector } from "react-redux"

export default function ClubsList(){
    const allClubs = useSelector((state: RootState) => state.clubs.data)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-2">
            {allClubs.map((club) => (
                <Link key={club.clubid} href={`/clubs/${club.clubid}`} className="hover:underline py-1">{club.clubname}</Link>
            ))}
        </div>
    )
}