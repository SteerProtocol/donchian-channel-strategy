import { getTickFromPrice, getTickSpacing, renderULMResult, PositionGenerator, PositionStyle } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { SlidingWindow, Candle, parseCandles, Position } from  "@steerprotocol/strategy-utils/assembly";
import { JSON } from "json-as/assembly";

@serializable
class Config {
  binSizeMultiplier: i32 = 0;
  binWidth: i32 = 0;
  poolFee: i32 = 0;
  period: i32 = 0;
  multiplier: f32 = 0;
  liquidityShape: string = "Linear";
  segments: i32 = 0;
  stdDeviation: i32 = 0;
}

let configJson: Config = new Config();

export function initialize(config: string): void {
  // Parse the config object
  configJson = JSON.parse<Config>(config);

  // Handle null cases
  if (
    // If we have a linear shape, we should bypass binSizeMultiplier
    configJson.liquidityShape == "Linear" ? false : configJson.binSizeMultiplier == 0 ||
    configJson.period == 0 ||
    configJson.poolFee == 0 ||
    configJson.multiplier == 0
  ) {
    throw new Error("Invalid configuration");
  }

  // Assign values to memory
  configJson.period = i32(configJson.period);
  configJson.binSizeMultiplier = i32(configJson.binSizeMultiplier);
  configJson.poolFee = i32(configJson.poolFee);
  configJson.binWidth = getTickSpacing(configJson.poolFee) * configJson.binSizeMultiplier;
  configJson.multiplier = f32(configJson.multiplier);
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
    return renderULMResult([], 0);
  }

  // Get Trailing stop price
  const channelData = donchianChannel(prices, i32(configJson.period));

  const upperLimit: f32 = channelData[0];
  const lowerLimit: f32 = channelData[1];

  if(upperLimit == 0 || lowerLimit == 0) {
    return renderULMResult([], 0);
  }

  const expandedLimits = expandChannel(upperLimit, lowerLimit, configJson.multiplier);

  const expandedUpperLimit = expandedLimits[0];
  const expandedLowerLimit = expandedLimits[1];
  
  const { upperTick, lowerTick } = formatTick(expandedUpperLimit, expandedLowerLimit, configJson.poolFee);
  
  // Calculate position
  const positionGenerator = new PositionGenerator();

  if(configJson.liquidityShape == "NormalDistribution") {
    positionGenerator.initializeNormalDistribution(((i32(upperTick) + i32(lowerTick))/2), configJson.stdDeviation, configJson.segments);
  }

  const positions = positionGenerator.generate(i32(upperTick), i32(lowerTick), configJson.binWidth, configJson.liquidityShape == "Linear" ? PositionStyle.ABSOLUTE : PositionStyle.NORMALIZED)

  // Format and return result
  return renderULMResult(positions, 10000);
}

function formatTick(expandedUpperLimit: number, expandedLowerLimit: number, poolFee: number): { upperTick: number, lowerTick: number } {
  const upperTick = closestDivisibleNumber(i32(Math.round(getTickFromPrice(f32(expandedUpperLimit)))), getTickSpacing(poolFee), false);
  const lowerTick = closestDivisibleNumber(i32(Math.round(getTickFromPrice(f32(expandedLowerLimit)))), getTickSpacing(poolFee), true);
  return { upperTick, lowerTick };
}

export function donchianChannel(
  prices: Candle[],
  periods: i32
): Array<f32> {
  if (prices.length < periods) {
    return [0, 0];
  }

  const highestHighs = new SlidingWindow<f32>(configJson.period, (window) =>
    f32(window.reduce((acc, v) => Math.max(acc, v), -Infinity))
  );
  const lowestLows = new SlidingWindow<f32>(configJson.period, (window) =>
    f32(window.reduce((acc, v) => Math.min(acc, v), Infinity))
  );

  for (let i = 0; i < prices.length; i++) {
    highestHighs.addValue(f32(prices[i].high));
    lowestLows.addValue(f32(prices[i].low));
  }

  const response = highestHighs.isStable() ? [highestHighs.getFormulaResult(), lowestLows.getFormulaResult()] : [0, 0];
  
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
    "type":"object", 
    "properties":{
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
        "description": "Pool fee percent for desired pool",
        "enum" : [10000, 3000, 500, 100],
        "enumNames": ["1%", "0.3%", "0.05%", "0.01%"]
      },
     "liquidityShape":{
        "enum":[
           "NormalDistribution",
           "Linear"
        ],
        "type":"string",
        "default": ""
     }
  },
  "allOf":[
     {
        "if":{
           "properties":{
              "liquidityShape":{
                 "const":"Linear"
              }
           }
        },
        "then":{
           "properties":{},
           "required":[]
        }
     },
     {
        "if":{
           "properties":{
              "liquidityShape":{
                 "const":"NormalDistribution"
              }
           }
        },
        "then":{
           "properties":{
              "binSizeMultiplier":{
                "type":"number",
                "title":"Bin Size Multiplier"
              }
           },
           "required":[
              "binSizeMultiplier"
           ]
        }
     },
     {
        "required":[
           "liquidityShape"
        ]
     }
  ],
    "required": ["period", "poolFee", "multiplier"]
  }`;
}

export function version(): i32 {
  return 1;
}