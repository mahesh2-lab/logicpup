import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "View your login in the LogicPup platform.",
  alternates: {
    canonical: "/login",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
