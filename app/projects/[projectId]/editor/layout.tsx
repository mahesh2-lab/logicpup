import type { Metadata } from "next";

type ProjectEditorLayoutProps = {
  params: Promise<{ projectId: string }>;
};

export async function generateMetadata({
  params,
}: ProjectEditorLayoutProps): Promise<Metadata> {
  const { projectId } = await params;

  return {
    title: `Project ${projectId} Editor`,
    description: `Edit project ${projectId} in the LogicPup visual Python flowchart editor.`,
    alternates: {
      canonical: `/projects/${projectId}/editor`,
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
