import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  let canonicalPath = "/dashboard/learn/[levelId]";
  // Very simplistic replacement for demo purposes, you'd replace params properly in a real app
  for (const key of Object.keys(p)) {
    canonicalPath = canonicalPath.replace(`[${key}]`, p[key]);
  }
  
  return {
    title: "Dashboard Learn",
    description: "View details for this dashboard learn in LogicPup.",
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
