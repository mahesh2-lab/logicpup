import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  const levelId = p.levelId;

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
