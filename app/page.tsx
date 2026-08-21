import type { Metadata } from "next";
import ClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Visual Python Flowchart IDE & Learning Playground",
  description: "The leash-free visual Python programming environment where logic meets fun. Connect flowchart blocks, fetch real Python 3 code, and chase zero bugs.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default function Page() {
  return <ClientPage />;
}

