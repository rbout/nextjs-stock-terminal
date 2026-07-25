"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import Card from "@/components/ui/Card";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";

type Mode = "sign-in" | "sign-up";

export default function AuthCard() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const isSignIn = mode === "sign-in";

  return (
    <Card className="w-full max-w-110 overflow-hidden rounded-3xl border-none p-8 shadow-md">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <h1 className="font-serif text-2xl font-semibold text-primary">
            {isSignIn ? "Sign in to your account" : "Create your account"}
          </h1>

          <form className="mt-6 flex flex-col gap-5">
            {!isSignIn && (
              <Input
                id="name"
                name="name"
                type="text"
                label="Full name"
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            )}

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@email.com"
              autoComplete="email"
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
              required
              action={
                isSignIn ? (
                  <Link
                    href="/forgot-password"
                    className="text-sm text-accent hover:underline"
                  >
                    Forgot your password?
                  </Link>
                ) : undefined
              }
            />

            {!isSignIn && (
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                label="Confirm password"
                autoComplete="new-password"
                required
              />
            )}

            {isSignIn && (
              <Checkbox
                id="remember"
                name="remember"
                label="Remember me on this device"
              />
            )}

            <button
              type="submit"
              className="cursor-pointer w-full rounded-lg bg-primary/80 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary"
            >
              {isSignIn ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary">
            {isSignIn ? (
              <>
                New to Next.js Stock Terminal?{" "}
                <button
                  type="button"
                  onClick={() => setMode("sign-up")}
                  className="cursor-pointer text-accent hover:underline"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("sign-in")}
                  className="cursor-pointer text-accent hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
