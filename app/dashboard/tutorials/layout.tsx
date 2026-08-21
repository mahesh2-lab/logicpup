import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Tutorials",
  description: "View your dashboard tutorials in the LogicPup platform.",
  alternates: {
    canonical: "/dashboard/tutorials",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
