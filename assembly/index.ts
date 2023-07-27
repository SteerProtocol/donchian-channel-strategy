import { CurvesConfigHelper, PositionGenerator, stringToPositionStyle, getTickFromPrice, getTickSpacing, renderULMResult, PositionStyle } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { console, Candle, SlidingWindow, parseCandles, Position, closestDivisibleNumber } from "@steerprotocol/strategy-utils/assembly";
import { JSON } from "json-as/assembly";
import { TriggerConfigHelper, TriggerStyle, allOfTrigger, getTriggerStyle, shouldTriggerExecution, triggerFromDistance, triggerPropertyHelper } from "./triggers";
// import { DonchianConfig, donchianLogic } from "./donchian";
// import { StrategyConfig, StrategyType, allOfStrategy, getStrategyEnum } from "./strategyHelper";
// import { BollingerConfig, bollingerLogic } from "./bollinger";
// import { KeltnerConfig, keltnerLogic } from "./keltner";
// import { ClassicConfig, classicLogic, getClassicConfig } from "./classic";
// import { StaticConfig, staticLogic } from "./static";

@json // @Note TriggerConfigHelper extends Curves Library

class Config  {
  lookback: i32 = 0;                                       // Lookback period for the donchian channel
  multiplier: f32 = 0;                                     // Multiplier for the channel width
  binSizeMultiplier: f32 = 0;                              // Multiplier for the minimum tick spacing (Creates the position width)
  standardDeviations: f64 = 0;
  atrLength: u32 = 0;
  // placementType: string = "Position over current price";
  // upperBound: i32 = 0;
  // lowerBound: i32 = 0;
  positionSize: i32 = 600;
  elapsedTendTime: i64 = 0;
  poolFee: i32 = 0;                                        // Pool fee
  liquidityShape: string = 'Absolute';                      // Liquidity style
  triggerStyle: string = 'None'
  // strategy: string = 'Bollinger Band'
  // trigger
  spreadPercentage: f64 = 0.0;
  triggerWhenOver: boolean = false;
  tickPriceTrigger: i64 = 0;
  percentageOfPositionRangeToTrigger: f64 = 0.0;
  tickDistanceFromCenter: i64 = 0;
  // active curve
    // ExponentialDecayOptions
    rate: f64 = 0;
    // NormalOptions
    mean: f64 = 0;
    stdDev: f64 = 0;
    // SigmoidOptions
    k: f64 = 0;
    // LogarithmicOptions
    base: f64 = 0;
    // PowerLawOptions
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

export function initialize(config: string): void {
  // Parse the config object
  configJson = JSON.parse<Config>(config);


  // Assign values to memory
  // configJson.poolFee = i32(configJson.poolFee); 
}

export function execute( _positions: string, _currentTick: string): string {
  // HANDLE TRIGGER LOGIC
  // const trigger = getTriggerStyle(configJson.triggerStyle)
  // const triggerObj = new TriggerConfigHelper(configJson.triggerWhenOver, configJson.tickPriceTrigger, configJson.percentageOfPositionRangeToTrigger, configJson.tickDistanceFromCenter, configJson.elapsedTendTime)
  // if (!shouldTriggerExecution(trigger, triggerObj, _positions, _currentTick, _timeSinceLastExecution)) return 'continue'

  // Get strat range
  let ticks: i64[] = []
  // let prices: Array<Candle> = []
  // const strategyType = getStrategyEnum(configJson.strategy)
  // switch (strategyType) {
  //   case StrategyType.Bollinger:
  //     // _prices will have the results of the dc, which is only candles here
  //     prices = parseCandles(_prices);
  //     // If we have no candles, skip action
  //     if (prices.length == 0) {
  //       return 'continue';
  //     }
  //     const bollingerConfigObj = new BollingerConfig(configJson.poolFee, configJson.lookback, configJson.standardDeviations)
  //     ticks = bollingerLogic(prices, bollingerConfigObj)
  //     break;
  //   // case StrategyType.Static:
  //   //   const staticConfigObj = new StaticConfig(configJson.poolFee, configJson.lowerBound, configJson.upperBound)
  //   //   ticks = staticLogic(staticConfigObj)
  //   //   break;
  //   case StrategyType.Donchian:
  //     prices = parseCandles(_prices);
  //     // If we have no candles, skip action
  //     if (prices.length == 0) {
  //       return 'continue';
  //     }
  //     const donchianConfigObj = new DonchianConfig(configJson.lookback, configJson.multiplier, configJson.binSizeMultiplier, configJson.poolFee)
  //     ticks = donchianLogic(prices, donchianConfigObj)
  //     break;
  //   case StrategyType.Keltner:
  //     prices = parseCandles(_prices);
  //     // If we have no candles, skip action
  //     if (prices.length == 0) {
  //       return 'continue';
  //     }
  //     const keltnerConfigObj = new KeltnerConfig(configJson.lookback, configJson.atrLength, configJson.multiplier, configJson.poolFee)
  //     ticks = keltnerLogic(prices, keltnerConfigObj)
  //     break
  
  //   default:
  const currentTick = i64(parseInt(_currentTick))
  // return configJson.positionSize.toString()
  // const classicConfigObj = new ClassicConfig(configJson.placementType, configJson.positionSize, configJson.poolFee)
  // ticks = classicLogic(currentTick, classicConfigObj)
  
  //=============
  // get variance
  const tickSpread = i64(Math.round(configJson.spreadPercentage * 10000))
  const tickSpacing = getTickSpacing(i32(configJson.poolFee))
  // let lowerTick: i32 = 0;
  // let upperTick: i32 = 0;
  // if (currentTick == 0) {
  //   lowerTick = 
  // }
  const lowerTick = i32(closestDivisibleNumber(f64(currentTick - tickSpread), tickSpacing, true))
  const upperTick = i32(closestDivisibleNumber(f64(currentTick + tickSpread), tickSpacing, false))

  // Get type of curve
  // const curveType = stringToPositionStyle(configJson.liquidityShape)
  // Calculate positions
  // const binWidth = i32(f32(getTickSpacing(configJson.poolFee)) * configJson.binSizeMultiplier);
  const positions: Position[] = []
  positions.push(new Position(lowerTick, upperTick, 100))
  // const positions = PositionGenerator.applyLiquidityShape(f64(upperTick), f64(lowerTick),
  // {
  //     // ExponentialDecayOptions
  // rate: configJson.rate,
  // // NormalOptions
  // mean: configJson.mean,
  // stdDev:  configJson.stdDev,
  // // SigmoidOptions
  // k:  configJson.k,
  // // LogarithmicOptions
  // base:  configJson.base, 
  // // PowerLawOptions
  // exponent:  configJson.exponent, 
  // // StepOptions
  // threshold:  configJson.threshold,
  // // SineOptions
  // amplitude:  configJson.amplitude,
  // frequency: configJson.frequency,
  // phase:  configJson.phase,
  // // TriangleOptions
  // period:  f64(configJson.period), // note overloaded var, @todo
  // // QuadraticOptions
  // a:  configJson.a,
  // b:  configJson.b,
  // c:  configJson.c, 
  // // CubicOptions
  // d:  configJson.d
  // }, binWidth, curveType);
  // Format and return result
  return renderULMResult(positions, 10000);
}

export function config(): string {
  return `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Strategy Config",
  "type": "object",
  "expectedDataTypes": ["Liquidity Manager Positions", "V3 Pool Current Tick", "Time Since Last Execution"],
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
    "spreadPercentage": {
      "title": "Position price spread from current price",
      "description": "The tick spread up and down applied from the current tick",
      "detailedDescription": "Inputting 0.25 will create a position covering roughly 25% above and below the current price.",
      "default": 0.25,
      "type": "number"
    }
  },
  "allOf": [
  ],
  "required": [
    "spreadPercentage"
  ]
}`;
}

// export function config(): string {
//   return `{
//   "$schema": "http://json-schema.org/draft-07/schema#",
//   "title": "Strategy Config",
//   "type": "object",
//   "expectedDataTypes": ["Liquidity Manager Positions", "V3 Pool Current Tick", "Time Since Last Execution"],
//   "properties": {
//     "poolFee": {
//       "description": "Pool fee percent for desired pool",
//       "title": "Pool Fee",
//       "enum": [
//         10000,
//         3000,
//         500,
//         100
//       ],
//       "enumNames": [
//         "1%",
//         "0.3%",
//         "0.05%",
//         "0.01%"
//       ]
//     },
//     "elapsedTendTime": {
//       "title": "Max Time Without Executing",
//       "description": "Regardless of the new position trigger conditions, the strategy will execute if this amount of time has elapsed.",
//       "type": "integer",
//       "default": 604800
//     },
//     "spreadPercentage": {
//       "title": "Position price spread from current price",
//       "description": "The tick spread up and down applied from the current tick",
//       "detailedDescription": "Inputting 0.25 will create a position covering roughly 25% above and below the current price.",
//       "default": 0.25,
//       "type": "number"
//     },
//     ${triggerPropertyHelper()},
//     ${PositionGenerator.propertyHelper([
//         PositionStyle.Normalized,
//         PositionStyle.Absolute,
//         // PositionStyle.Linear, // We always want linear
//         PositionStyle.Sigmoid,
//         PositionStyle.PowerLaw,
//         PositionStyle.Step,
//         // PositionStyle.Sine,
//         PositionStyle.Triangle,
//         PositionStyle.Quadratic,
//         PositionStyle.Cubic,
//         // PositionStyle.ExponentialDecay,
//         // PositionStyle.ExponentialGrowth,
//         // PositionStyle.Logarithmic,
//         // PositionStyle.LogarithmicDecay,
//         PositionStyle.Sawtooth,
//         PositionStyle.SquareWave
//     ])}
//   },
//   "allOf": [
//     ${PositionGenerator.allOf()},
//     ${allOfTrigger()}
//   ],
//   "required": [
//     "spreadPercentage",
//     "elapsedTendTime"
//   ]
// }`;
// }

export function version(): i32 {
  return 1;
}

