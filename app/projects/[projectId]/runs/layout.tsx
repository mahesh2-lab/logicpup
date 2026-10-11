import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p = await params;
  const projectId = p.projectId;

  return {
    title: `Project ${projectId} Runs`,
    description: `View run history and execution output for LogicPup project ${projectId}.`,
    alternates: {
      canonical: `/projects/${projectId}/runs`,
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
