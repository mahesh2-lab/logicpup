import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Projects",
  description:
    "Browse and manage your saved LogicPup visual Python projects from one place.",
  alternates: {
    canonical: "/dashboard/projects",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
