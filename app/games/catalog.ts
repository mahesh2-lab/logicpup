import RacingGame from "./Racing";
import MemoryGame from "./Memory";
import TypingGame from "./Typing";

export const GAMES_CATALOG = [
  {
    id: "racing",
    name: "Pac-Coder",
    description: "Code your Pac-Man to the finish line without hitting ghosts.",
    cost: 0,
    component: RacingGame,
    color: "#F26A3D"
  },
  {
    id: "memory",
    name: "Memory Match",
    description: "Match the cards to test your memory.",
    cost: 15,
    component: MemoryGame,
    color: "#3B82F6"
  },
  {
    id: "typing",
    name: "Code Typer",
    description: "Type code snippets quickly to earn XP.",
    cost: 30,
    component: TypingGame,
    color: "#10B981"
  }
];
