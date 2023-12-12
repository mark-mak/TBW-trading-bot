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
  const leverage = 2;
  const params = {
    leverage,
  };

  let lastAction = "";
  let isClose = false;
  let isMust = false;
  let hasPosition = false;
  const leverageRes = await exchange.setLeverage(leverage, symbol);
  console.log("leverageRes:", leverageRes);

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
    console.log("trendingStr:", trendingStr, "momentumStr:", momentumStr);
    isMust = false;
    if (momentumStr.indexOf("must") > -1 && hasPosition) {
      isMust = true;
      return momentumStr.substring(5);
    } else if (momentumStr.indexOf(trendingStr) > -1 || hasPosition) {
      return trendingStr;
    } else {
      return "";
    }
  };

  const tick = async () => {
    const positions = await exchange.fetchPositions();

    console.log("positions:", positions);
    hasPosition = positions.length > 0 && positions[0].notional > 0;

    // Your logic that decides when to make a trade
    const action = await strategy();

    const balance = await exchange.fetchBalance();
    // console.log("balance", balance);

    const ticker = await exchange.fetchTicker(symbol);
    // console.log("ticker", ticker);

    let price = (ticker.ask + ticker.bid) / 2; // The current price of the asset
    let amount = getAmount(balance.free.USDT, price) * leverage;

    if (hasPosition) {
      lastAction = getAction(positions[0].side);
      amount = getAmount(positions[0].notional, price);
      isClose = true;
      if (positions[0].side === "long") {
        price = ticker.ask * 0.8 + ticker.bid * 0.2;
      } else if (positions[0].side === "short") {
        price = ticker.ask * 0.2 + ticker.bid * 0.8;
      }
    }

    const decision = lastAction !== action ? action : "";
    console.log("lastAction: ", lastAction, "action: ", action);
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
      if (!isMust) {
        lastAction = isClose ? "" : decision;
      }
    } else if (decision === "sell") {
      // Sell
      const order = await exchange.createLimitSellOrder(
        symbol,
        amount,
        price,
        params
      );
      console.log(order);
      if (!isMust) {
        lastAction = isClose ? "" : decision;
      }
    }

    // Make sure to add error handling and manage your orders / trades
  };

  // Example: run the tick function every minute
  tick();
  setInterval(tick, 60 * 1000);
})();
