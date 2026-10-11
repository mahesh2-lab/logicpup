import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arcade",
  description:
    "Open the LogicPup Arcade to unlock coding mini-games with XP from your Python learning journey.",
  alternates: {
    canonical: "/games",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
