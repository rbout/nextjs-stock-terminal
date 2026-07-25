import Link from "next/link";

import AuthCard from "@/components/login/AuthCard";
import RibbonBackground from "@/components/login/RibbonBackground";

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="absolute inset-0 hidden md:block">
        <RibbonBackground />
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-card-border px-8 py-5">
        <div className="font-serif text-2xl font-semibold">
          <span className="text-accent">Next.js</span>{" "}
          <span className="text-primary">Stock Terminal</span>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
        <AuthCard />
      </main>

      <footer className="relative z-10 border-t border-card-border px-6 py-6 text-center text-sm text-secondary">
        <p className="mx-auto max-w-2xl">
          This is a demo project built for portfolio purposes, not a real
          brokerage. It uses live market data, but all trades are simulated
          and no real money changes hands. Feel free to sign up with a fake
          email and a fake password to try it out.{" "}
          <Link href="/disclaimer" className="text-accent hover:underline">
            Read the full disclaimer
          </Link>
        </p>
      </footer>
    </div>
  );
}
