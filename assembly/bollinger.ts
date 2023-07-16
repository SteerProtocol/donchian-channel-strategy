import { getTickFromPrice, getTickSpacing } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { Candle, _mean, _standardDeviation, closestDivisibleNumber } from "@steerprotocol/strategy-utils/assembly";

export class BollingerConfig {
    poolFee: i32 = 0;
    lookback: i32 = 0;
    standardDeviations: f64 = 0;
    constructor(_poolFee: i32, _lookback: i32, _standardDeviations: f64){
        this.poolFee = _poolFee
        this.lookback = _lookback
        this.standardDeviations = _standardDeviations
    }
}

export function getBollingerConfig(): string {
    return `      "lookback": {
        "type": "number",
        "description": "Number of candles in smoothing lookback (used for SMA)",
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
  
  const upperTick = i64(closestDivisibleNumber(i32(Math.round(getTickFromPrice(f64(upperLimit)))), getTickSpacing(configJson.poolFee), false));
  const lowerTick = i64(closestDivisibleNumber(i32(Math.round(getTickFromPrice(f64(lowerLimit)))), getTickSpacing(configJson.poolFee), true));

  return [lowerTick, upperTick]
}