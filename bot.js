import * as Strategies from "./strategies/index.js";
import ccxt from "ccxt";
import "dotenv/config";

(async () => {
  const exchange = new ccxt.bitmex({
    apiKey: process.env.API_KEY,
    secret: process.env.API_SECRET,
    timeout: 30000,
    enableRateLimit: true,
  });

  if (exchange.urls["test"]) {
    exchange.urls["api"] = exchange.urls["test"]; // ←----- switch the base URL to testnet
  }

  //   exchange.loadMarkets();

  const symbol = "XBTUSD"; // Example: Trading pair
  const params = {
    leverage: 10, // for exchanges that support leverage
  };

  const strategy = async () => {
    // This would be your trading logic
    // For example, fetching moving averages and deciding when to buy/sell based on how they intersect.
    // Placeholder for your strategy logic.
    return Strategies.goldCrossStr();
  };

  const tick = async () => {
    const ticker = await exchange.fetchTicker(symbol);

    console.log("ticker:", ticker);

    // Your logic that decides when to make a trade
    let decision = await strategy(ticker);

    if (decision === "buy") {
      // Buy
      const amount = 0.01; // The amount of the asset to buy
      const order = await exchange.createLimitBuyOrder(
        symbol,
        amount,
        ticker.ask,
        params
      );
      console.log(order);
    } else if (decision === "sell") {
      // Sell
      const amount = 0.01; // The amount of the asset to sell
      const order = await exchange.createLimitSellOrder(
        symbol,
        amount,
        ticker.bid,
        params
      );
      console.log(order);
    }

    // Make sure to add error handling and manage your orders / trades
  };

  // Example: run the tick function every minute
  setInterval(tick, 60 * 1000);
})();
