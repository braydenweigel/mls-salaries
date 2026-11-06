"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import players from "@/lib/data/players.json"
import clubs from "@/lib/data/clubs.json"
import records from "@/lib/data/records.json"
import type { Player, Club, PlayerRecord } from "@/lib/data/types"
import { POSITION_LABELS } from "@/lib/globals"

const allPlayers = players as Player[]
const allClubs = clubs as Club[]
const allRecords = records as PlayerRecord[]
const clubsMap = new Map(allClubs.map((club) => [club.clubid, club]))

const SEASON_ORDER: Record<string, number> = { "Spring": 0, "Fall": 1 }

const latestRecordByPlayer = new Map<string, PlayerRecord>()
for (const record of allRecords){
  const existing = latestRecordByPlayer.get(record.playerid)
  if (
    !existing ||
    Number(record.recordyear) > Number(existing.recordyear) ||
    (record.recordyear === existing.recordyear && SEASON_ORDER[record.recordseason] > SEASON_ORDER[existing.recordseason])
  ) {
    latestRecordByPlayer.set(record.playerid, record)
  }
}

function getInitials(name: string){
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function SearchPage(){
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState(searchParams.get("q") ?? "")

  React.useEffect(() => {
    setQuery(searchParams.get("q") ?? "")
  }, [searchParams])

  const f = query.trim().toLowerCase()

  const matchedPlayers = f.length === 0 ? [] : allPlayers.filter((player) =>
    `${player.lastname} ${player.firstname}`.toLowerCase().includes(f)
  )

  const matchedClubs = f.length === 0 ? [] : allClubs.filter((club) =>
    club.clubname.toLowerCase().includes(f) || club.clubid.toLowerCase().includes(f)
  )

  const hasResults = matchedPlayers.length > 0 || matchedClubs.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search")
  }

  return (
    <div>
      <div className="hidden shrink-0 md:flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-foreground">Search</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-4">Search Results</h1>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-lg">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a player or club"
            className="h-11 pl-9"
            autoFocus
          />
        </div>
        <Button type="submit" size="lg" className="h-11">Search</Button>
      </form>

      {f.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Start typing to search players and clubs.</p>
      ) : !hasResults ? (
        <p className="mt-8 text-sm text-muted-foreground">No results for &quot;{query}&quot;.</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {matchedPlayers.length > 0 && (
            <section>
              <h2 className="mb-2 text-lg font-semibold">
                Players <span className="font-normal text-muted-foreground">({matchedPlayers.length})</span>
              </h2>
              <div className="rounded-lg border divide-y">
                {matchedPlayers.map((player) => {
                  const record = latestRecordByPlayer.get(player.playerid)
                  const club = record ? clubsMap.get(record.club) : undefined
                  const positionLabel = record ? POSITION_LABELS[record.position] ?? record.position : null

                  return (
                    <Link
                      key={player.playerid}
                      href={`/players/${player.playerid}`}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {getInitials(`${player.lastname} ${player.firstname}`)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-tight">{player.lastname} {player.firstname}</p>
                        {record && (
                          <p className="truncate text-xs text-muted-foreground">
                            {club?.clubname ?? record.club}{positionLabel ? ` · ${positionLabel}` : ""}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {matchedClubs.length > 0 && (
            <section>
              <h2 className="mb-2 text-lg font-semibold">
                Clubs <span className="font-normal text-muted-foreground">({matchedClubs.length})</span>
              </h2>
              <div className="rounded-lg border divide-y">
                {matchedClubs.map((club) => (
                  <Link
                    key={club.clubid}
                    href={`/clubs/${club.clubid}`}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted"
                  >
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white"
                      style={{ backgroundColor: club.colorprimary }}
                    >
                      {club.clubid}
                    </span>
                    <p className="text-sm font-semibold">{club.clubname}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
