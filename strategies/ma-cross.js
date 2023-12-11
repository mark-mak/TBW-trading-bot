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

export const crossStr = async (closePrices) => {
  // Calculate the short-term and long-term SMAs
  const shortTermPeriod = 7;
  const longTermPeriod = 25;

  const shortSMA = await calculateSMA(closePrices, shortTermPeriod);
  const longSMA = await calculateSMA(closePrices, longTermPeriod);

  // Compare the last values of both SMAs to determine a crossover
  const lastShortSMA = shortSMA[shortSMA.length - 1];
  const last2ShortSMA = shortSMA[shortSMA.length - 2];
  const lastLongSMA = longSMA[longSMA.length - 1];
  const last2LongSMA = longSMA[longSMA.length - 2];
  console.log(`Short SMA: ${lastShortSMA}, Long SMA: ${lastLongSMA}`);

  let decision = null;

  if (lastShortSMA > lastLongSMA && last2ShortSMA < last2LongSMA) {
    decision = "buy";
    console.log("Buy signal generated");
    // Define the order logic here (create buy order)
  } else if (lastShortSMA < lastLongSMA && last2ShortSMA > last2LongSMA) {
    decision = "sell";
    console.log("Sell signal generated");
    // Define the order logic here (create sell order)
  } else {
    // console.log("No crossover, no action");
  }

  return "";
};