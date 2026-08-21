import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  let canonicalPath = "/projects/[projectId]/settings";
  // Very simplistic replacement for demo purposes, you'd replace params properly in a real app
  for (const key of Object.keys(p)) {
    canonicalPath = canonicalPath.replace(`[${key}]`, p[key]);
  }
  
  return {
    title: "Projects Settings",
    description: "View details for this projects settings in LogicPup.",
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
