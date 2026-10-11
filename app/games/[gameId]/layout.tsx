import type { Metadata } from "next";
import { GAMES_CATALOG } from "../catalog";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  const gameId = p.gameId as string;
  const game = GAMES_CATALOG.find((item) => item.id === gameId);
  const gameName = game?.name ?? "Game";

  return {
    title: `${gameName} Game`,
    description: `Play ${gameName} inside LogicPup's coding arcade.`,
    alternates: {
      canonical: `/games/${gameId}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
