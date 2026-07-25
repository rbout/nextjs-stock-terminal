import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import ThemeToggle from "@/components/ui/ThemeToggle";
import GrainOverlay from "@/components/ui/GrainOverlay";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stock Terminal",
  description:
    "A portfolio project styled as a stock trading terminal. Simulated trades, live market data, no real money involved.",
};

const themeInitScript = `
  (function () {
    try {
      var stored = localStorage.getItem("theme");
      var theme =
        stored === "light" || stored === "dark"
          ? stored
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lora.variable} ${inter.variable} h-full antialiased`}
    >
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </head>
    <body
      suppressHydrationWarning
      className="min-h-full flex flex-col bg-background text-primary font-sans"
    >
    {children}
    <GrainOverlay />
    <ThemeToggle />
    </body>
    </html>
  );
}
