import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { PlayerData } from "../page"
import { getPlayerReleaseStats } from "@/lib/compare-players-utils"

type PlayerSummaryCardProps = {
    player: PlayerData
    color: string
    onRemove: () => void
}

export function PlayerSummaryCard({ player, color, onRemove }: PlayerSummaryCardProps){
    const stats = getPlayerReleaseStats(player)

    return (
        <>
            {/* compact pill, mobile only */}
            <div className="sm:hidden flex w-fit max-w-full items-center gap-2 rounded-full border bg-card pl-3 pr-1.5 py-1.5">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }}/>
                <Link
                    href={`/players/${player.player.playerid}`}
                    className="min-w-0 truncate text-sm font-medium hover:underline"
                >
                    {stats.displayName}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={onRemove}
                    aria-label={`Remove ${stats.displayName}`}
                >
                    <X className="size-3.5"/>
                </Button>
            </div>
            {/* full card, sm and up */}
            <Card className="hidden sm:flex gap-3 py-4 px-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }}/>
                        <Link
                            href={`/players/${player.player.playerid}`}
                            className="min-w-0 truncate text-sm md:text-base font-semibold hover:underline"
                        >
                            {stats.displayName}
                        </Link>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={onRemove}
                        aria-label={`Remove ${stats.displayName}`}
                    >
                        <X className="size-3.5"/>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    {stats.rangeLabel}
                </p>
                <div>
                    <p className="text-xs text-muted-foreground">Latest guaranteed comp.</p>
                    <p className="text-lg font-bold tabular-nums">${stats.latestGuaranteed.toLocaleString()}</p>
                </div>
            </Card>
        </>
    )
}
