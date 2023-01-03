import { JSON } from "assemblyscript-json";
import {Position, parsePrices, getTickFromPrice, renderULMResult, getTickSpacing, Price } from "@steerprotocol/strategy-utils";


let width: i32 = 600;
let percent: f32 = 0;
let poolFee: i32 = 0;

export function initialize(config: string): void {
  // Parse the config object
  const configJson = <JSON.Obj>JSON.parse(config);
  // Get our config variables
  const _width = configJson.getInteger("binWidth");
  const _poolFee = configJson.getInteger("poolFee");
  const _percent = configJson.getValue("percent");
  // Handle null case
  if (_width == null || _percent == null || _poolFee == null) {
    throw new Error("Invalid configuration");
  }

  // Handle percents presented as integers
  if (_percent.isFloat) {
    const f_percent = <JSON.Num>_percent
    percent = f32(f_percent._num);
  }
  if (_percent.isInteger) {
    const i_percent = <JSON.Integer>_percent
    percent = f32(i_percent._num);
  }
  // Assign values to memory
  width = i32(_width._num);
  poolFee = i32(_poolFee._num);
}

export function execute(_prices: string): string {
  // _prices will have the results of the dc, which is only candles here
  const prices = parsePrices(_prices, 0);
  // If we have no candles, skip action
  if (prices.length == 0) {return `continue`}
  // Get Trailing stop price
  const channelData = donchianChannel(prices, 5)

  const upperChannel = channelData[0];
  const lowerChannel = channelData[1];

  const upperLimit = upperChannel[upperChannel.length - 1];
  const lowerLimit = lowerChannel[lowerChannel.length - 1];

  // Calculate position
  const positions = calculateBin(upperLimit, lowerLimit);
  
  // Format and return result
  return renderULMResult(positions);
}

export function donchianChannel(prices: Price[], periods: i32): Array<Float32Array> {
  let highestHighs = new Float32Array(prices.length);
  let lowestLows = new Float32Array(prices.length);

  for (let i = 0; i < prices.length; i++) {
    let high = -Infinity;
    let low = Infinity;
    for (let j = i; j > i - periods && j >= 0; j--) {
      high = Math.max(high, prices[j].close);
      low = Math.min(low, prices[j].close);
    }
    highestHighs[i] = f32(high);
    lowestLows[i] = f32(low);
  }

  return [highestHighs, lowestLows];
}


function calculateBin(upper: f32, lower: f32): Position[] {

  // Calculate the upper tick
  const upperTick: i32 = i32(Math.round(getTickFromPrice(upper)));

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

  return positions
}

export function config(): string{
  return `{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Strategy Config",
    "type": "object",
    "properties": {
      "percent": {
          "type": "number",
          "description": "Percent for trailing stop order",
          "default": 5.0
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
    "required": ["percent", "binWidth", "poolFee"]
  }`;
}

export function version(): i32 {
  return 1;
}

