import type { Player, Club } from '@/lib/data/types'

export function isValidPlayer(players: Player[], id: string) {
  return players.find((p) => p.playerid === id) || null;
}

export function isValidClub(clubs: Club[], id: string) {
  return clubs.find((c) => c.clubid === id) || null;
}
