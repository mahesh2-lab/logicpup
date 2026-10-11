import type { Metadata } from "next";

type LevelLayoutProps = {
  params: Promise<{ levelId: string }>;
};

export async function generateMetadata({ params }: LevelLayoutProps): Promise<Metadata> {
  const { levelId } = await params;

  return {
    title: `Lesson ${levelId}`,
    description: `Open LogicPup lesson ${levelId} and practice Python concepts in the visual learning workspace.`,
    alternates: {
      canonical: `/dashboard/learn/${levelId}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
