import { CurvesConfigHelper, getTickFromPrice, getTickSpacing, renderULMResult } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { console, Candle, SlidingWindow, parseCandles, Position, closestDivisibleNumber } from "@steerprotocol/strategy-utils/assembly";
import { JSON } from "json-as/assembly";
import { TriggerConfigHelper, TriggerStyle, allOfTrigger, getTriggerStyle, shouldTriggerExecution, TriggerInfo, triggerPropertyHelper } from "@steerprotocol/strategy-utils/assembly/utils/triggers";
import { DonchianConfig, donchianChannel, donchianLogic, expandChannel, formatTick } from "./donchian";
import { PositionStyle, stringToPositionStyle } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { PositionGenerator } from "@steerprotocol/concentrated-liquidity-strategy/assembly";

// @ts-ignore
@json // @Note TriggerConfigHelper extends Curves Library

class Config  {
  lookback: i32 = 0;                                       // Lookback period for the donchian channel
  multiplier: f32 = 0;                                     // Multiplier for the channel width
  binSizeMultiplier: f32 = 0;                              // Multiplier for the minimum tick spacing (Creates the position width)
  poolFee: i32 = 0;

  //
  triggerStyle: TriggerInfo = new TriggerInfo("",[])
  triggerWhenOver: boolean = false;
  tickPriceTrigger: i64 = 0;
  percentageOfPositionRangeToTrigger: f64 = 0.0;
  tickDistanceFromCenter: i64 = 0;
  elapsedTendTime: i64 = 0;
  //
  //
  //
  liquidityShape: string = 'Basic';
  // no Basic
reflect: boolean = false;
invert: boolean = false;
  // most options
  bins: i32 = 0;
  // Triangle
  // active curve
  // ExponentialDecayOptions
  // rate: f64 = 0;
  // NormalOptions
  mean: f64 = 0;
  stdDev: f64 = 0;
  // SigmoidOptions
  k: f64 = 0;
  // LogarithmicOptions
  base: f64 = 0;
  // // PowerLawOptions
  exponent: f64 = 0;
  // StepOptions
  threshold: f64 = 0;
  // SineOptions
  amplitude: f64 = 0;
  frequency: f64 = 0;
  phase: f64 = 0;
  // TriangleOptions
  period: f64 = 0;
  // QuadraticOptions
  a: f64 = 0;
  b: f64 = 0;
  c: f64 = 0;
  // CubicOptions
  d: f64 = 0;


}

// 
let configJson: Config = new Config();
const strategyDataConnectors = ["OHLC"]

export function initialize(config: string): void {
  // Parse the config object
  configJson = JSON.parse<Config>(config);


  // Assign values to memory
  // configJson.poolFee = i32(configJson.poolFee); 
}

export function execute(_prices: string, _positions: string, _currentTick: string, _timeSinceLastExecution: string): string {
  // _prices will have the results of the dc, which is only candles here
  const prices = parseCandles(_prices);
  // If we have no candles, skip action
  if (prices.length == 0) {
    return 'continue';
  }
  // HANDLE TRIGGER LOGIC
  const triggerObj: TriggerConfigHelper = new TriggerConfigHelper(
    configJson.triggerWhenOver,
    configJson.tickPriceTrigger,
    configJson.percentageOfPositionRangeToTrigger,
    configJson.tickDistanceFromCenter,
    configJson.elapsedTendTime
    )


  // No trigger? skip action
  if (!shouldTriggerExecution(configJson.triggerStyle.name, triggerObj, _positions, _currentTick, _timeSinceLastExecution)) {
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

    // CURVE
  // Get type of curve
  const range = i32(upperTick - lowerTick)
  const curveType = stringToPositionStyle(configJson.liquidityShape)
  const positionWidth = curveType == PositionStyle.Basic ? range : i32(closestDivisibleNumber((range / configJson.bins), getTickSpacing(configJson.poolFee), false))
  // Calculate positions
  // const binWidth = range//i32(f32(getTickSpacing(configJson.poolFee)) * configJson.binSizeMultiplier);
  const positions = PositionGenerator.applyLiquidityShape(f64(upperTick), f64(lowerTick),
  {
    reflect: configJson.reflect,
    invert: configJson.invert,
      // ExponentialDecayOptions
  rate: 0,//configJson.rate,
  // NormalOptions
  mean: f64((upperTick + lowerTick) / 2), // @note gets set to this anyway
  stdDev:  configJson.stdDev,
  // SigmoidOptions
  k:  configJson.k,
  // LogarithmicOptions
  base:  configJson.base,
  // PowerLawOptions
  exponent:  configJson.exponent, 
  // StepOptions
  threshold: 0,//  configJson.threshold,
  // SineOptions
  amplitude:  configJson.amplitude,
  frequency: configJson.frequency,
  phase:  configJson.phase,
  // TriangleOptions
  period:  f64(configJson.period),
  // QuadraticOptions
  a: configJson.a,
  b:  configJson.b,
  c:  configJson.c, 
  // CubicOptions
  d:  configJson.d
  }, positionWidth, curveType);
  // Format and return result
  return renderULMResult(positions, 10000);
}

export function config(): string {
  return `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Strategy Config",
  "type": "object",
  "properties": {
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
    ${triggerPropertyHelper(strategyDataConnectors)},
    ${PositionGenerator.propertyHelper([
      PositionStyle.Normalized,
      PositionStyle.Basic,
      PositionStyle.Linear,
      PositionStyle.Sigmoid,
      PositionStyle.PowerLaw,
      // PositionStyle.Step,
      PositionStyle.Sine,
      PositionStyle.Triangle, 
      PositionStyle.Quadratic,
      // PositionStyle.Cubic,
      // PositionStyle.ExponentialDecay,
      // PositionStyle.ExponentialGrowth,
      PositionStyle.Logarithmic,
      // PositionStyle.LogarithmicDecay,
      // PositionStyle.Sawtooth,
      // PositionStyle.SquareWave
  ])}
  },
  "allOf": [
    ${allOfTrigger(strategyDataConnectors)},
    ${PositionGenerator.allOf()}
  ]
}`;
}

export function version(): i32 {
  return 1;
}

