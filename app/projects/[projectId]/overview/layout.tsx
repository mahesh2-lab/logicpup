import type { Metadata } from "next";

type ProjectOverviewLayoutProps = {
  params: Promise<{ projectId: string }>;
};

export async function generateMetadata({
  params,
}: ProjectOverviewLayoutProps): Promise<Metadata> {
  const { projectId } = await params;

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
