import Card from "@/components/ui/Card";
import LogoutButton from "@/components/ui/LogoutButton";
import Sidebar from "@/components/dashboard/Sidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 px-6 py-10 md:px-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-primary">
              Dashboard
            </h1>
            <p className="mt-2 text-secondary">
              Stat cards, watchlist, performance chart, and holdings land
              here next.
            </p>
          </div>

          <LogoutButton />
        </div>

        <Card className="mt-8 p-6">
          <p className="text-sm text-muted">Design tokens check</p>
          <p className="mt-1 font-serif text-2xl font-semibold text-primary">
            $128,430.12
          </p>
          <p className="mt-1 text-sm text-positive-strong">+1.37% today</p>
        </Card>
      </main>
    </div>
  );
}
