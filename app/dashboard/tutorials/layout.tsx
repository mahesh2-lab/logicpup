import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Tutorials",
  description:
    "Access LogicPup tutorial tracks to practice Python logic with guided visual exercises.",
  alternates: {
    canonical: "/dashboard/tutorials",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
