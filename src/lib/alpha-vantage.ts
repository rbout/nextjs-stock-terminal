const BASE_URL = "https://www.alphavantage.co/query";

type AlphaVantageParams = Record<string, string>;

// The API returns wildly different shapes per `function`, and typing each one isn't worth it until real UI is consuming the data, callers can narrow this themselves.
type AlphaVantageResponse = Record<string, unknown>;

function getApiKey(): string {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) {
    throw new Error(
      "Missing ALPHA_VANTAGE_API_KEY. Copy .env.local.example to .env.local and add your key."
    );
  }
  return key;
}

async function callAlphaVantage(
  params: AlphaVantageParams,
  revalidateSeconds: number
): Promise<AlphaVantageResponse> {
  const apiKey = getApiKey();
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString(), {
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`Alpha Vantage request failed: ${res.status}`);
  }

  const data = (await res.json()) as AlphaVantageResponse;

  if (data.Note || data.Information) {
    throw new Error(String(data.Note ?? data.Information));
  }

  return data;
}

export function getQuote(symbol: string) {
  return callAlphaVantage({ function: "GLOBAL_QUOTE", symbol }, 300);
}

export function getDailyTimeSeries(symbol: string) {
  return callAlphaVantage(
    { function: "TIME_SERIES_DAILY", symbol, outputsize: "compact" },
    3600
  );
}

export function getTopMovers() {
  return callAlphaVantage({ function: "TOP_GAINERS_LOSERS" }, 900);
}

export function getMarketStatus() {
  return callAlphaVantage({ function: "MARKET_STATUS" }, 900);
}

type NewsSentimentOptions = {
  tickers?: string;
  topics?: string;
};

export function getNewsSentiment({ tickers, topics }: NewsSentimentOptions = {}) {
  const params: AlphaVantageParams = { function: "NEWS_SENTIMENT" };
  if (tickers) params.tickers = tickers;
  if (topics) params.topics = topics;
  return callAlphaVantage(params, 900);
}

export function getCompanyOverview(symbol: string) {
  return callAlphaVantage({ function: "OVERVIEW", symbol }, 86400);
}

export type EconomicIndicatorFunction =
  | "CPI"
  | "UNEMPLOYMENT"
  | "FEDERAL_FUNDS_RATE"
  | "TREASURY_YIELD";

export function getEconomicIndicator(functionName: EconomicIndicatorFunction) {
  return callAlphaVantage({ function: functionName }, 86400);
}

export function getEarningsCalendar() {
  return callAlphaVantage(
    { function: "EARNINGS_CALENDAR", horizon: "3month" },
    86400
  );
}

export function getIpoCalendar() {
  return callAlphaVantage({ function: "IPO_CALENDAR" }, 86400);
}
