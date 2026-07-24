import Card from "@/components/ui/Card";
import RibbonBackground from "@/components/login/RibbonBackground";

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-10">
      <div className="absolute inset-0 hidden md:block">
        <RibbonBackground />
      </div>

      <Card className="relative z-10 w-full max-w-[440px] p-8">
        <h1 className="font-serif text-2xl font-semibold text-primary">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Email/password, remember me, Google, and passkey sign-in land here
          next.
        </p>
      </Card>
    </main>
  );
}
