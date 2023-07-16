import { getTickFromPrice, getTickSpacing } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { Candle, _mean, _standardDeviation, closestDivisibleNumber } from "@steerprotocol/strategy-utils/assembly";

class BollingerConfig {
    poolFee: i32 = 0;
    period: i32 = 0;
    standardDeviations: f64 = 0;
}

export function getBollingerConfig(): string {
    return `      "period": {
        "type": "number",
        "description": "Number of candles in smoothing period (used for SMA)",
        "default": 20
    },
    "standardDeviations": {
        "type": "number",
        "description": "How many standard deviations from the SMA to set the position",
        "default": 2
    },`
}

export function bollingerLogic(prices: Candle[], configJson: BollingerConfig): i64[] {
      // Generate closes array
  const closes: f64[] = [];
  for (let index = 0; index < prices.length; index++) {
    closes.push((prices[index].close))
  }

  const priceSMA = _mean(closes)

  // Calculate stddev
  const stddev = _standardDeviation(closes);

  const upperLimit: f64 = priceSMA + (configJson.standardDeviations * stddev);
  const lowerLimit: f64 = priceSMA - (configJson.standardDeviations * stddev);
  
  const upperTick = closestDivisibleNumber(i32(Math.round(getTickFromPrice(f64(upperLimit)))), getTickSpacing(configJson.poolFee), false);
  const lowerTick = closestDivisibleNumber(i32(Math.round(getTickFromPrice(f64(lowerLimit)))), getTickSpacing(configJson.poolFee), true);

  return [lowerTick, upperTick]
}