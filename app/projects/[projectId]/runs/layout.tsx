import type { Metadata } from "next";

type ProjectRunsLayoutProps = {
  params: Promise<{ projectId: string }>;
};

export async function generateMetadata({
  params,
}: ProjectRunsLayoutProps): Promise<Metadata> {
  const { projectId } = await params;

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
