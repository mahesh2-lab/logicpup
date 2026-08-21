import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Settings",
  description: "View your dashboard settings in the LogicPup platform.",
  alternates: {
    canonical: "/dashboard/settings",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
