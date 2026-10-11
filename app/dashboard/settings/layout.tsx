import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Settings",
  description:
    "Update your LogicPup account, editor preferences, and learning profile settings.",
  alternates: {
    canonical: "/dashboard/settings",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
