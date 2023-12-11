import ccxt from "ccxt";

(async () => {
  // Instantiate the BitMEX exchange
  let bitmex = new ccxt.bitmex();

  // Check if the exchange has the capability we need
  if (bitmex.has.fetchTickers) {
    try {
      // Fetch all tickers
      let tickers = await bitmex.fetchTickers();
      console.log(tickers);
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("The exchange does not support the method fetchTickers.");
  }

  // Fetch ticker for a specific symbol, if desired
  let symbol = "BTC/USD"; // Example symbol, the BitMEX BTC/USD contract

  if (bitmex.has.fetchTicker) {
    try {
      let ticker = await bitmex.fetchTicker(symbol);
      console.log(`${symbol} Ticker:`);
      console.log(ticker);
    } catch (error) {
      console.error(`Error fetching ticker for symbol ${symbol}:`, error);
    }
  } else {
    console.log("The exchange does not support the method fetchTicker.");
  }
})();
