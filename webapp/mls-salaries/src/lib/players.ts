import { PlayerList } from "@/app/players/compare/page";
import { CURRENT_YEAR } from "./globals";

export const initialPlayerList: PlayerList = {
  data: [{stackID: "a", player: null},
  {stackID: "b", player: null},
  {stackID: "c", player: null},
  {stackID: "d", player: null}],
  numPlayers: 0,
  min: CURRENT_YEAR,
  max: CURRENT_YEAR
}