# bitmex-bot

This is a trading bot developed with Node JS and applied in [BITmex](https://www.bitmex.com/).

## Installation

```bash
npm install
```

## Usage

```bash
API_KEY={{YOUR_API_KEY}} API_SECRET={{YOUR_API_SECRET}} node bot.js
```

## Strategies

1. Simple Moving Average (SMA): a short-term MA and a long-term MA. A buy signal is generated when the short-term MA crosses above the long-term MA, indicating upward momentum. Conversely, a sell signal is generated when the short-term MA crosses below the long-term MA, indicating downward momentum.

2. Relative Strength Index (RSI): indicators that is used to generate a buy or sell signal, in order to stop loss or take profit.

Using the above strategies at the same time, the bot will make orders by the generated signal.
