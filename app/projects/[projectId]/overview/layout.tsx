import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  const projectId = p.projectId;

  return {
    title: `Project ${projectId} Overview`,
    description: `Review project ${projectId} details, files, and progress in LogicPup.`,
    alternates: {
      canonical: `/projects/${projectId}/overview`,
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
