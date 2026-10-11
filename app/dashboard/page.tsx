import type { Metadata } from "next";
import DashboardClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Dashboard Home",
  description:
    "See your LogicPup learning snapshot, recent visual Python activity, and next beginner milestones.",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardPage() {
  return <DashboardClientPage />;
}
