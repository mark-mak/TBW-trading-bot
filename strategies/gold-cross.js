import ccxt from "ccxt";
import "dotenv/config";

async function calculateSMA(data, window_size) {
  let sma = [];
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    if (i >= window_size - 1) {
      sma.push(sum / window_size);
      sum -= data[i - (window_size - 1)];
    }
  }

  return sma;
}

export const goldCrossStr = async () => {
  // Assume we're using the Binance exchange
  const exchange = new ccxt.bitmex({
    apiKey: process.env.API_KEY,
    secret: process.env.API_SECRET,
    timeout: 30000,
    enableRateLimit: true,
  });

  const symbol = "BTC/USDT";
  const timeframe = "1h"; // 1-hour candles

  // Fetch historical price data (closing prices)
  const ohlcv = await exchange.fetchOHLCV(symbol, timeframe);
  const closingPrices = ohlcv.map((candle) => candle[4]); // Index 4 is the closing price

  // Calculate the short-term and long-term SMAs
  const shortTermPeriod = 7;
  const longTermPeriod = 25;

  const shortSMA = await calculateSMA(closingPrices, shortTermPeriod);
  const longSMA = await calculateSMA(closingPrices, longTermPeriod);

  // Compare the last values of both SMAs to determine a crossover
  const lastShortSMA = shortSMA[shortSMA.length - 1];
  const lastLongSMA = longSMA[longSMA.length - 1];

  let decision = null;

  if (lastShortSMA > lastLongSMA) {
    decision = "buy";
    console.log("Buy signal generated");
    // Define the order logic here (create buy order)
  } else if (lastShortSMA < lastLongSMA) {
    decision = "sell";
    console.log("Sell signal generated");
    // Define the order logic here (create sell order)
  } else {
    console.log("No crossover, no action");
  }

  return decision;
};
