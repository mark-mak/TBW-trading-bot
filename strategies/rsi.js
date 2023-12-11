import { RSI } from "technicalindicators";

const shortTermPeriod = 6;
const longTermPeriod = 14;
const rsiOversold = 30;
const rsiOverbought = 70;

export const rsiStr = (closePrices) => {
  const shortTermRsi = RSI.calculate({
    period: shortTermPeriod,
    values: closePrices,
  });
  const longTermRsi = RSI.calculate({
    period: longTermPeriod,
    values: closePrices,
  });

  const lastShortTermRsi = shortTermRsi[shortTermRsi.length - 1];
  const lastLongTermRsi = longTermRsi[longTermRsi.length - 1];

  console.log(`Short RSI: ${lastShortTermRsi}, Long RSI: ${lastLongTermRsi}`);

  // Check if we already have an open position
  // This is pseudo code since this logic will very much depend on your balance management
  let hasOpenPosition = false; // Replace with your actual position-checking logic here

  if (!hasOpenPosition) {
    if (
      lastShortTermRsi < rsiOversold &&
      lastLongTermRsi > rsiOversold &&
      lastLongTermRsi < rsiOverbought
    ) {
      console.log("Long signal");
      // Add your logic to enter a long position here
    } else if (
      lastShortTermRsi > rsiOverbought &&
      lastLongTermRsi < rsiOverbought &&
      lastLongTermRsi > rsiOversold
    ) {
      console.log("Short signal");
      // Add your logic to enter a short position here
    }
  } else {
    // Here you'd likely want to check if need to exit your position based on RSI or other criteria
  }

  return "";
};
