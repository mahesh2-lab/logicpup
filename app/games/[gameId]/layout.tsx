import type { Metadata } from "next";
import { GAMES_CATALOG } from "../catalog";

type GameLayoutProps = {
  params: Promise<{ gameId: string }>;
};

export async function generateMetadata({ params }: GameLayoutProps): Promise<Metadata> {
  const { gameId } = await params;
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
