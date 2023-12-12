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

  //   if (exchange.urls["test"]) {
  //     exchange.urls["api"] = exchange.urls["test"]; // ←----- switch the base URL to testnet
  //   }

  //   exchange.loadMarkets();

  const symbol = "XBTUSDT"; // Example: Trading pair
  const params = {
    leverage: 10, // for exchanges that support leverage
  };

  let lastAction = "";
  let isClose = false;
  let isMust = false;

  const getAction = (side) => {
    if (side === "long") {
      return "buy";
    } else if (side === "short") {
      return "sell";
    } else {
      return "";
    }
  };

  const getAmount = (_amount, _price) => {
    return Math.round((_amount / _price) * 1e3) * 1000;
  };

  const strategy = async () => {
    // This would be your trading logic
    // For example, fetching moving averages and deciding when to buy/sell based on how they intersect.
    const timeframe = "5m";
    const ohlcv = await exchange.fetchOHLCV(symbol, timeframe);
    const closePrices = ohlcv.map((candle) => candle[4]); // Get 'close' price for each candle
    const trendingStr = Strategies.crossStr(closePrices);
    const momentumStr = Strategies.rsiStr(closePrices);
    isMust = false;
    if (momentumStr.indexOf("must") > -1) {
      isMust = true;
      return momentumStr.substring(5);
    } else if (momentumStr.indexOf(trendingStr) > -1) {
      return trendingStr;
    } else {
      return "";
    }
  };

  const tick = async () => {
    const positions = await exchange.fetchPositions();

    console.log("positions:", positions);

    // Your logic that decides when to make a trade
    const action = await strategy();

    const balance = await exchange.fetchBalance();
    console.log("balance", balance);

    const ticker = await exchange.fetchTicker(symbol);
    console.log("ticker", ticker);

    const price = (ticker.ask + ticker.bid) / 2; // The current price of the asset
    let amount = getAmount(balance.free.USDT / 2, price);

    if (positions.length > 0 && positions[0].notional > 0) {
      lastAction = getAction(positions[0].side);
      amount = getAmount(positions[0].notional, price);
      isClose = true;
    }

    const decision = lastAction !== action ? action : "";
    console.log("decision:", decision);
    console.log("amount:", amount);

    if (decision === "buy") {
      // Buy
      const order = await exchange.createLimitBuyOrder(
        symbol,
        amount,
        price,
        params
      );
      console.log(order);
      lastAction = isClose && !isMust ? "" : decision;
    } else if (decision === "sell") {
      // Sell
      const order = await exchange.createLimitSellOrder(
        symbol,
        amount,
        price,
        params
      );
      console.log(order);
      lastAction = isClose && !isMust ? "" : decision;
    }

    // Make sure to add error handling and manage your orders / trades
  };

  // Example: run the tick function every minute
  tick();
  setInterval(tick, 60 * 1000);
})();
