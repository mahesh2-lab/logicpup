import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Collections",
  description: "View your dashboard collections in the LogicPup platform.",
  alternates: {
    canonical: "/dashboard/collections",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
