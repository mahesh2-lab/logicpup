import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Projects",
  description: "View your dashboard projects in the LogicPup platform.",
  alternates: {
    canonical: "/dashboard/projects",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
