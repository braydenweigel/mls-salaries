import type { Player } from "./store/playersSlice";
import type { Club } from "./store/clubsSlice";

export function isValidPlayer(players: Player[], id: string) {
  return players.find((p) => p.playerid === id) || null;
}

export function isValidClub(clubs: Club[], id: string) {
  return clubs.find((c) => c.clubid === id) || null;
}
