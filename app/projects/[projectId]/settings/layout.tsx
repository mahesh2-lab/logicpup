import type { Metadata } from "next";

type ProjectSettingsLayoutProps = {
  params: Promise<{ projectId: string }>;
};

export async function generateMetadata({
  params,
}: ProjectSettingsLayoutProps): Promise<Metadata> {
  const { projectId } = await params;

  return {
    title: `Project ${projectId} Settings`,
    description: `Configure project ${projectId} preferences and management options in LogicPup.`,
    alternates: {
      canonical: `/projects/${projectId}/settings`,
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
