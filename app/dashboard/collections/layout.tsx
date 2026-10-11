import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Collections",
  description:
    "Organize your LogicPup project collections and quickly reopen visual Python workflows.",
  alternates: {
    canonical: "/dashboard/collections",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
