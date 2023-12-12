function calculateSMA(data, window_size) {
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

export const crossStr = (closePrices) => {
  // Calculate the short-term and long-term SMAs
  const shortTermPeriod = 7;
  const longTermPeriod = 14;

  const shortSMA = calculateSMA(closePrices, shortTermPeriod);
  const longSMA = calculateSMA(closePrices, longTermPeriod);

  // Compare the last values of both SMAs to determine a crossover
  const lastShortSMA = shortSMA[shortSMA.length - 1];
  const lastLongSMA = longSMA[longSMA.length - 1];
  console.log(`Short SMA: ${lastShortSMA}, Long SMA: ${lastLongSMA}`);

  let decision = "";

  if (lastShortSMA > lastLongSMA) {
    decision = "buy";
    console.log("Buy signal generated");
    // Define the order logic here (create buy order)
  } else if (lastShortSMA < lastLongSMA) {
    decision = "sell";
    console.log("Sell signal generated");
    // Define the order logic here (create sell order)
  }

  return decision;
};
