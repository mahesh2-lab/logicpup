import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL as string;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LogicPup — Visual Python Flowchart IDE & Learning Playground",
    template: "%s | LogicPup",
  },
  description:
    "The leash-free visual Python programming environment where logic meets fun. Connect flowchart blocks, fetch real Python 3 code, and chase zero bugs without getting tangled in syntax.",
  applicationName: "LogicPup",
  authors: [{ name: "LogicPup Team", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "visual python editor",
    "python flowchart programming",
    "learn python for beginners",
    "python for kids and students",
    "block based python",
    "interactive python playground",
    "python AST compiler",
    "flowchart to python code",
    "python 3.12 learning track",
    "coding curriculum",
    "logic pup",
  ],
  referrer: "origin-when-cross-origin",
  creator: "LogicPup Inc.",
  publisher: "LogicPup Inc.",
  category: "education",
  classification: "Educational Technology & Programming",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LogicPup — Visual Python Flowchart IDE & Learning Playground",
    description:
      "Connect flowchart blocks, fetch real Python 3 code, and chase zero bugs. The visual Python playground made for future developers.",
    url: siteUrl,
    siteName: "LogicPup",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "LogicPup — Visual Python Flowchart IDE",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LogicPup — Visual Python Flowchart IDE & Learning Playground",
    description:
      "Connect flowchart blocks, fetch real Python 3 code, and chase zero bugs. Good boy, clean code! 🐾",
    creator: "@logicpup",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}
