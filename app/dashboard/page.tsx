import type { Metadata } from "next";
import DashboardClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your LogicPup learning dashboard.",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardPage() {
  return <DashboardClientPage />;
}

