import { CurvesConfigHelper, PositionGenerator, stringToPositionStyle, getTickFromPrice, getTickSpacing, renderULMResult, PositionStyle } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { console, Candle, SlidingWindow, parseCandles, Position, closestDivisibleNumber } from "@steerprotocol/strategy-utils/assembly";
import { JSON } from "json-as/assembly";
import { TriggerConfigHelper, TriggerStyle, allOfTrigger, getTriggerStyle, shouldTriggerExecution, triggerPropertyHelper } from "./triggers";
import { donchianLogic } from "./donchian";
import { StrategyType, allOfStrategy, getStrategyEnum } from "./strategyHelper";
import { bollingerLogic } from "./bollinger";
import { keltnerLogic } from "./keltner";
import { classicLogic } from "./classic";

// @JSON // @Note TriggerConfigHelper extends Curves Library
class Config extends TriggerConfigHelper {
  lookback: i32 = 0;                                       // Lookback period for the donchian channel
  multiplier: f32 = 0;                                     // Multiplier for the channel width
  binSizeMultiplier: f32 = 0;                              // Multiplier for the minimum tick spacing (Creates the position width)
  period: i32 = 0;
  standardDeviations: f64 = 0;
  atrLength: u32 = 0;
  placementType: string = "Position over current price";
  positionSize: i64 = 600;
  elapsedTendTime: i64 = 0;
  poolFee: i32 = 0;                                        // Pool fee
  liquidityShape: string = 'Absolute';                      // Liquidity style
  triggerStyle: string = 'None'
  strategy: string = 'Bollinger Band'
}

// 
let configJson: Config = new Config();

export function initialize(config: string): void {
  // Parse the config object
  configJson = JSON.parse<Config>(config);

  // Assign values to memory
  configJson.poolFee = i32(configJson.poolFee);
}

export function execute(_prices: string, _positions: string, _currentTick: string, _timeSinceLastExecution: string): string {
  // _prices will have the results of the dc, which is only candles here
  const prices = parseCandles(_prices);
  // If we have no candles, skip action
  if (prices.length == 0) {
    return 'continue';
  }
  // HANDLE TRIGGER LOGIC
  const trigger = getTriggerStyle(configJson.triggerStyle)
  if (!shouldTriggerExecution(trigger, configJson, _positions, _currentTick, _timeSinceLastExecution)) return 'continue'

  // Get strat range
  let ticks: i64[] = []
  const strategyType = getStrategyEnum(configJson.strategy)
  switch (strategyType) {
    case StrategyType.Bollinger:
      ticks = bollingerLogic(prices, configJson)
      break;
    // case StrategyType.Stable:
    //   ticks = stableLogic()
    //   break;
    case StrategyType.Donchian:
      ticks = donchianLogic(prices, configJson)
      break;
    case StrategyType.Keltner:
      ticks = keltnerLogic(prices, configJson)
      break
  
    default:
      const currentTick = parseInt(_currentTick)
      if (!currentTick) throw new Error("Err on current tick");
      ticks = classicLogic(currentTick, configJson)
      break;
  }
  
  const lowerTick = ticks[0];
  const upperTick = ticks[1];

  // Get type of curve
  const curveType = stringToPositionStyle(configJson.liquidityShape)
  // Calculate positions
  const binWidth = i32(f32(getTickSpacing(configJson.poolFee)) * configJson.binSizeMultiplier);
  const positions = PositionGenerator.applyLiquidityShape(upperTick, lowerTick, configJson, binWidth, curveType);
  // Format and return result
  return renderULMResult(positions, 10000);
}

export function config(): string {
  return `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Strategy Config",
  "type": "object",
  "expectedDataTypes": ["OHLC", "Liquidity Manager Positions", "V3 Pool Current Tick", "Time Since Last Execution"],
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
    "elapsedTendTime": {
      "title": "Max Time Without Executing",
      "description": "Regardless of the new position trigger conditions, the strategy will execute if this amount of time has elapsed.",
      "type": "integer",
      "default": 604800
    }
    ${triggerPropertyHelper()},
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
    ${PositionGenerator.allOf()},
    ${allOfTrigger()},
    ${allOfStrategy}
  ],
}`;
}

export function version(): i32 {
  return 1;
}

