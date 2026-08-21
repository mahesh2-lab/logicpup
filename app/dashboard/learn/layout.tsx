import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Learn",
  description: "View your dashboard learn in the LogicPup platform.",
  alternates: {
    canonical: "/dashboard/learn",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
