import { getTickFromPrice, getTickSpacing, renderULMResult, PositionGenerator, PositionStyle } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { SlidingWindow, Candle, parseCandles, Position, console } from  "@steerprotocol/strategy-utils/assembly";
import { JSON } from "json-as/assembly";

let width: i32 = 600;
let period: i32 = 0;
let poolFee: i32 = 0;
let multiplier: f32 = 1;

@serializable
class Config {
  binWidth: i32 = 0;
  poolFee: i32 = 0;
  period: i32 = 0;
  multiplier: f32 = 0;
}

export function initialize(config: string): void {
  // Parse the config object
  const configJson: Config = JSON.parse<Config>(config);

  // Handle null case
  if (
    configJson.binWidth == 0 ||
    configJson.period == 0 ||
    configJson.poolFee == 0 ||
    configJson.multiplier == 0
  ) {
    throw new Error("Invalid configuration");
  }

  // Assign values to memory
  period = i32(configJson.period);
  width = i32(configJson.binWidth);
  poolFee = i32(configJson.poolFee);
  multiplier = f32(configJson.multiplier);
}

function closestDivisibleNumber(num: number, divisor: number, floor: boolean): number {
  if (floor) return Math.floor(num / divisor) * divisor;
  return Math.ceil(num / divisor) * divisor;
}

export function execute(_prices: string): string {
  // _prices will have the results of the dc, which is only candles here
  const prices = parseCandles(_prices);
  // If we have no candles, skip action
  if (prices.length == 0) {
    return `continue`;
  }

  // Get Trailing stop price
  const channelData = donchianChannel(prices, i32(period));

  const upperChannel = channelData[0];
  const lowerChannel = channelData[1];

  const upperLimit: f32 = upperChannel[upperChannel.length - 1];
  const lowerLimit: f32 = lowerChannel[lowerChannel.length - 1];

  const expandedLimits = expandChannel(upperLimit, lowerLimit, multiplier);

  const expandedUpperLimit = expandedLimits[0];
  const expandedLowerLimit = expandedLimits[1];
  
  const upperTick = closestDivisibleNumber(i32(Math.round(getTickFromPrice(f32(expandedUpperLimit)))), getTickSpacing(poolFee), false);
  const lowerTick = closestDivisibleNumber(i32(Math.round(getTickFromPrice(f32(expandedLowerLimit)))), getTickSpacing(poolFee), true);
  // console.log(getTickSpacing(poolFee).toString());
  // Calculate position
  const positionGenerator = new PositionGenerator(((i32(upperTick) + i32(lowerTick))/2), 4, 6);
  
  const positions = positionGenerator.generate(i32(upperTick), i32(lowerTick), width, PositionStyle.NORMALIZED)

  // Format and return result
  return renderULMResult(positions, 10000);
}

export function donchianChannel(
  prices: Candle[],
  periods: i32
): Array<Array<f32>> {
  if (prices.length < periods) {
    return [[0], [0]];
  }

  const highestHighs = new SlidingWindow<f32>(period, (window) =>
    f32(window.reduce((acc, v) => Math.max(acc, v), 0.0))
  );
  const lowestLows = new SlidingWindow<f32>(period, (window) =>
    f32(window.reduce((acc, v) => Math.min(acc, v), 0.0))
  );

  for (let i = 0; i < prices.length; i++) {
    highestHighs.addValue(f32(prices[i].high));
    lowestLows.addValue(f32(prices[i].low));
  }

  const response = [highestHighs.getWindow(), lowestLows.getWindow()];
  return response;
}

function calculateBin(upper: f32, lower: f32): Position[] {
  if (upper == 0 || lower == 0) {
    return [];
  }

  // Calculate the upper tick
  const tick = getTickFromPrice(upper);
  const roundedTick = Math.round(tick);
  const upperTick: i32 = i32(roundedTick);

  // Calculate the lower tick
  const lowerTick: i32 = i32(Math.round(getTickFromPrice(lower)));

  // Get the spacing
  const tickSpacing = getTickSpacing(poolFee);

  // Step up ticks until we reach an initializable tick
  let _upper: i32 = upperTick;
  while (_upper % tickSpacing !== 0) {
    _upper++;
  }

  // Step down ticks until we reach an initializable tick
  let _lower: i32 = lowerTick;
  while (_lower % tickSpacing !== 0) {
    _lower--;
  }

  const positions: Array<Position> = [];
  const position = new Position(_lower, _upper, 1);
  positions.push(position);

  return positions;
}

export function expandChannel(
  upper: f64,
  lower: f64,
  multiplier: f64
): Array<f64> {
  return [upper * multiplier, lower / multiplier];
}

export function config(): string {
  return `{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Strategy Config",
    "type": "object",
    "properties": {
      "period": {
          "type": "number",
          "description": "Lookback period for channel",
          "default": 5
      },
      "multiplier": {
          "type": "number",
          "description": "Multiplier for channel width",
          "default": 1.0
      },
      "poolFee": {
        "description": "Pool fee percent for desired Uniswapv3 pool",
        "enum" : [10000, 3000, 500, 100],
        "enumNames": ["1%", "0.3%", "0.05%", "0.01%"]
      },
      "binWidth": {
          "type": "number",
          "description": "Width for liquidity position, must be a multiple of pool tick spacing",
          "default": 600
      }
    },
    "required": ["period", "binWidth", "poolFee", "multiplier"]
  }`;
}

export function version(): i32 {
  return 1;
}
