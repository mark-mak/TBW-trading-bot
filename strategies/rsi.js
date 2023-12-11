import { RSI } from "technicalindicators";

const longTermPeriod = 14;
const rsiOversold = 30;
const rsiCanSell = 45;
const rsiCanBuy = 55;
const rsiOverbought = 70;

export const rsiStr = (closePrices) => {
  const longTermRsi = RSI.calculate({
    period: longTermPeriod,
    values: closePrices,
  });

  const lastLongTermRsi = longTermRsi[longTermRsi.length - 1];

  console.log(`RSI: ${lastLongTermRsi}`);

  if (lastLongTermRsi < rsiOversold) {
    console.log("RSI is oversold, MUST buy");
    return "must buy";
  } else if (lastLongTermRsi < rsiCanSell) {
    console.log("RSI is can sell, can sell");
    return "can sell";
  } else if (lastLongTermRsi <= rsiCanBuy) {
    console.log("RSI is uncertain, do nothing");
    return "";
  } else if (lastLongTermRsi <= rsiOverbought) {
    console.log("RSI is can buy, can buy");
    return "can buy";
  } else {
    console.log("RSI is overbought, MUST sell");
    return "must sell";
  }
};
