import { CurvesConfigHelper, PositionGenerator, stringToPositionStyle, getTickFromPrice, getTickSpacing, renderULMResult, PositionStyle } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { console, Candle, SlidingWindow, parseCandles, Position } from "@steerprotocol/strategy-utils/assembly";
import { JSON } from "json-as/assembly";

@json
class Config extends CurvesConfigHelper {
  lookback: i32 = 0;                                       // Lookback period for the donchian channel
  multiplier: f32 = 0;                                     // Multiplier for the channel width
  binSizeMultiplier: f32 = 0;                              // Multiplier for the minimum tick spacing (Creates the position width)
  poolFee: i32 = 0;                                        // Pool fee
  liquidityShape: string = 'Absolute';                      // Liquidity style
}

// 
let configJson: Config = new Config();

export function initialize(config: string): void {
  // Parse the config object
  configJson = JSON.parse<Config>(config);

  // Handle null cases
  if (
    configJson.poolFee == 0 ||
    configJson.multiplier == 0 ||
    configJson.lookback == 0
  ) {
    throw new Error("Invalid configuration");
  }

  // Assign values to memory
  configJson.binSizeMultiplier = f32(configJson.binSizeMultiplier);
  configJson.poolFee = i32(configJson.poolFee);
}

function closestDivisibleNumber(num: number, divisor: number, floor: boolean): number {
  if (floor) return Math.floor(num / divisor) * divisor;
  return Math.ceil(num / divisor) * divisor;
}

// in this context we will return the lowest start tick and the greatest uppertick,
//   to encompass all active areas of the current postions

function parsePositions(_positions: string): Position {
  // _positions will be '[[#,#,#],[#,#,#],[#,#,#]]' presumably. lower, upper, weight
  // clean up our list by removing spaces and brackets
  let positions = _positions.replaceAll(' ','');
  positions = positions.replaceAll('[','');
  let rangeArray = positions.split(']',2);
  let startTick = rangeArray[0].split(',')[0];
  const endTicks = rangeArray[1].split(',');
  let endTick = endTicks[endTicks.length-1]
  const strArrays = [startTick, endTick];
  // check null
  if (strArrays[0] == '' || strArrays[0] == null || strArrays[1] == '' || strArrays[1] == null) {
    return new Position(0, 0, 0);
  }
  // else return normal
  const lowerTick = i32(parseInt(strArrays[0]));
  const upperTick = i32(parseInt(strArrays[1]));
  // weights shouldn't matter in this context, we just want the total active range
  return new Position(lowerTick, upperTick, 100);
}

export function execute(_prices: string, _positions: string, _currentTick: string): string {
  // _prices will have the results of the dc, which is only candles here
  const prices = parseCandles(_prices);
  // If we have no candles, skip action
  if (prices.length == 0) {
    return 'continue';
  }

  let currentPosition: Position;
  if (_currentTick == null) throw new Error("CurrentTick reading null");
  const currentTick = parseInt(_currentTick);
  currentPosition = parsePositions(_positions);

  currentPosition = parsePositions(_positions);
  // In bounds? skip action
  if ((currentTick <= currentPosition.endTick && currentTick >= currentPosition.startTick)) {
    return `continue`;
  }

  const channelData = donchianChannel(prices, i32(configJson.lookback));

  const upperLimit: f64 = channelData[0];
  const lowerLimit: f64 = channelData[1];

  if(upperLimit == 0 || lowerLimit == 0) {
    return 'continue';
  }

  const expandedLimits = expandChannel(upperLimit, lowerLimit, configJson.multiplier);

  const expandedUpperLimit = expandedLimits[0];
  const expandedLowerLimit = expandedLimits[1];
  
  const formattedTicks = formatTick(expandedUpperLimit, expandedLowerLimit, configJson.poolFee);
  
  const upperTick = formattedTicks[0];
  const lowerTick = formattedTicks[1];
  // Calculate positions
  const binWidth = i32(f32(getTickSpacing(configJson.poolFee)) * configJson.binSizeMultiplier);

  const positionStyle = stringToPositionStyle(configJson.liquidityShape);
  
  const positions = PositionGenerator.applyLiquidityShape(upperTick, lowerTick, configJson, binWidth, positionStyle);
  // const positions: Array<Position> = [new Position(i32(upperTick), i32(lowerTick), 10000)]
  // Format and return result
  return renderULMResult(positions, 10000);
}

function formatTick(expandedUpperLimit: number, expandedLowerLimit: number, poolFee: number): Array<number> {
  const upperTick = closestDivisibleNumber(i32(Math.round(getTickFromPrice(f32(expandedUpperLimit)))), getTickSpacing(i32(poolFee)), false);
  const lowerTick = closestDivisibleNumber(i32(Math.round(getTickFromPrice(f32(expandedLowerLimit)))), getTickSpacing(i32(poolFee)), true);
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

export function config(): string {
  return `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Strategy Config",
  "type": "object",
  "expectedDataTypes": ["OHLC", "ULM Positions", "Current Tick (slot0)"],
  "properties": {
    "lookback": {
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
    },
    "poolFee": {
      "description": "Pool fee percent for desired pool",
      "title": "Pool Fee",
      "enum": [
        10000,
        3000,
        500,
        100
      ],
      "enumNames": [
        "1%",
        "0.3%",
        "0.05%",
        "0.01%"
      ]
    },
    ${PositionGenerator.propertyHelper([
        PositionStyle.Normalized,
        PositionStyle.Absolute,
        // PositionStyle.Linear, // We always want linear
        PositionStyle.Sigmoid,
        PositionStyle.PowerLaw,
        PositionStyle.Step,
        // PositionStyle.Sine,
        PositionStyle.Triangle,
        PositionStyle.Quadratic,
        PositionStyle.Cubic,
        // PositionStyle.ExponentialDecay,
        // PositionStyle.ExponentialGrowth,
        // PositionStyle.Logarithmic,
        // PositionStyle.LogarithmicDecay,
        PositionStyle.Sawtooth,
        PositionStyle.SquareWave
    ])}
  },
  "allOf": [
    ${PositionGenerator.allOf()}
  ],
  "required": [
    "lookback",
    "poolFee",
    "multiplier"
  ]
}`;
}

export function version(): i32 {
  return 1;
}

