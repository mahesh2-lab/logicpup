import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | LogicPup",
  description: "Log in or sign up to LogicPup to save your Python flowchart projects, progress, and certificates.",
  alternates: {
    canonical: "/login",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
