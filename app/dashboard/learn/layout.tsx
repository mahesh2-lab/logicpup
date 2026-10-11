import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Learn",
  description:
    "Continue LogicPup lessons and level up Python fundamentals with visual flowchart learning.",
  alternates: {
    canonical: "/dashboard/learn",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
