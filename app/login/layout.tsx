import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Log in to LogicPup to save visual Python projects, continue lessons, and track beginner coding progress.",
  alternates: {
    canonical: "https://logicpup.heymahesh.in/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
