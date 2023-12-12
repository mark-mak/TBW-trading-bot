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

  const symbol = "XBTUSDT"; // Example: Trading pair
  const params = {
    leverage: 10, // for exchanges that support leverage
  };

  let lastAction = "";

  const strategy = async () => {
    // This would be your trading logic
    // For example, fetching moving averages and deciding when to buy/sell based on how they intersect.
    const timeframe = "5m";
    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe);
    const closePrices = ohlcv.map((candle) => candle[4]); // Get 'close' price for each candle
    const trendingStr = Strategies.crossStr(closePrices);
    const momentumStr = Strategies.rsiStr(closePrices);
    if (momentumStr.indexOf("must") > -1) {
      return momentumStr.substring(5);
    } else if (momentumStr.indexOf(trendingStr)) {
      return trendingStr;
    } else {
      return "";
    }
  };

  const tick = async () => {
    const ticker = await exchange.fetchTicker(symbol);
    const price = (ticker.ask + ticker.bid) / 2; // The current price of the asset

    const balance = await exchange.fetchBalance();
    const amount = Math.round(balance.free.USDT / 2 / price * 1E8) / 100; // The amount of the asset to action

    const positions = await exchange.fetchPositions();

    console.log("positions:", positions);

    // Your logic that decides when to make a trade
    const action = await strategy();
    const decision = lastAction !== action ? action : "";

    if (decision === "buy") {
      // Buy
      const order = await exchange.createLimitBuyOrder(
        symbol,
        amount,
        price,
        params
      );
      console.log(order);
      lastAction = decision;
    } else if (decision === "sell") {
      // Sell
      const order = await exchange.createLimitSellOrder(
        symbol,
        amount,
        price,
        params
      );
      console.log(order);
      lastAction = decision;
    }

    // Make sure to add error handling and manage your orders / trades
  };

  // Example: run the tick function every minute
  tick();
  setInterval(tick, 60 * 1000);
})();
