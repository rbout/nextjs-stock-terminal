type StockDetailPageProps = {
  params: Promise<{ symbol: string }>;
};

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const { symbol } = await params;

  return (
    <main className="flex-1 px-6 py-10 md:px-10">
      <h1 className="font-serif text-3xl font-semibold text-primary">
        {symbol.toUpperCase()}
      </h1>
      <p className="mt-2 text-secondary">
        Header, price chart, key stats, company overview, news, and the
        &ldquo;your position&rdquo; widget land here next.
      </p>
    </main>
  );
}
