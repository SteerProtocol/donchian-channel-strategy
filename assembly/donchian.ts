import { getTickSpacing, PositionGenerator, renderULMResult, getTickFromPrice } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { Candle, closestDivisibleNumber, SlidingWindow } from "@steerprotocol/strategy-utils/assembly";


export class DonchianConfig {
    lookback: i32 = 0;                                       // Lookback period for the donchian channel
    multiplier: f32 = 0;                                     // Multiplier for the channel width
    binSizeMultiplier: f32 = 0;                              // Multiplier for the minimum tick spacing (Creates the position width)
    poolFee: i32 = 0;
    constructor (_lookback: i32, _multiplier: f32, _binSizeM:f32, _poolFee: i32){
      this.lookback = _lookback
      this.multiplier = _multiplier
      this.binSizeMultiplier = _binSizeM
      this.poolFee = _poolFee
    }
}

export function donchianLogic(prices: Candle[], configJson: DonchianConfig): i64[] {

    const channelData = donchianChannel(prices, i32(configJson.lookback));
  
    const upperLimit: f64 = channelData[0];
    const lowerLimit: f64 = channelData[1];
  
    // if(upperLimit == 0 || lowerLimit == 0) {
    //   return 'continue';
    // }
  
    const expandedLimits = expandChannel(upperLimit, lowerLimit, configJson.multiplier);
  
    const expandedUpperLimit = expandedLimits[0];
    const expandedLowerLimit = expandedLimits[1];
    
    const formattedTicks = formatTick(expandedUpperLimit, expandedLowerLimit, f64(configJson.poolFee));
    
    const upperTick = formattedTicks[0];
    const lowerTick = formattedTicks[1];
    // Calculate positions
    // const binWidth = i32(f32(getTickSpacing(configJson.poolFee)) * configJson.binSizeMultiplier);
  
    // const positionStyle = stringToPositionStyle(configJson.liquidityShape);
    return [lowerTick, upperTick]

  }
  
  export function formatTick(expandedUpperLimit: number, expandedLowerLimit: number, poolFee: number): i64[] {
    const upperTick = i64(closestDivisibleNumber(i32(Math.round(getTickFromPrice(f32(expandedUpperLimit)))), getTickSpacing(i32(poolFee)), false));
    const lowerTick = i64(closestDivisibleNumber(i32(Math.round(getTickFromPrice(f32(expandedLowerLimit)))), getTickSpacing(i32(poolFee)), true));
    return [ upperTick, lowerTick ];
  }
  
  export function donchianChannel(
    prices: Candle[],
    periods: i32
  ): Array<f64> {
  
    const interval = prices.length < periods ? prices.length : periods
  
    const highestHighs = new SlidingWindow<f64>(interval, (window) =>
      f64(window.reduce((acc, v) => Math.max(acc, v), -Infinity))
    );
    const lowestLows = new SlidingWindow<f64>(interval, (window) =>
      f64(window.reduce((acc, v) => Math.min(acc, v), Infinity))
    );
  
    // go from the back
    for (let i = prices.length - interval; i < prices.length; i++) {
      highestHighs.addValue(f64(prices[i].high));
      lowestLows.addValue(f64(prices[i].low));
    }
  
    // const response = highestHighs.isStable() ? [highestHighs.getFormulaResult(), lowestLows.getFormulaResult()] : [0, 0];
    const response = [highestHighs.getFormulaResult(), lowestLows.getFormulaResult()]
    return response;
  }
  
  export function expandChannel(
    upper: f64,
    lower: f64,
    multiplier: f64
  ): Array<f64> {
    return [upper * multiplier, lower / multiplier];
  }

  export function getDonchianConfig(): string {
    return `"lookback": {
        "type": "number",
        "title": "Channel Lookback",
        "description": "Lookback period for channel",
        "detailedDescription": "Number of candles to use for the channel",
        "default": 5
      },
      "multiplier": {
        "type": "number",
        "title": "Channel Multiplier",
        "description": "Multiplier for channel width",
        "detailedDescription": "Example: 5% channel width = 1.05",
        "default": 1
      }`
  }