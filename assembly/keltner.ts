import { getTickFromPrice, getTickSpacing } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { Candle, closestDivisibleNumber } from "@steerprotocol/strategy-utils/assembly";

export class KeltnerConfig {
    lookback: i32 = 0;
    atrLength: i32 = 0;
    multiplier: f64 = 0;
    poolFee: i32 = 0;
    constructor (_lookback: i32, _atrLength: i32, _multiplier: f32, _poolFee: i32){
      this.lookback = _lookback
      this.multiplier = _multiplier
      this.atrLength = _atrLength
      this.poolFee = _poolFee
    }
}

export function getKeltnerConfig(): string {
    return `    "lookback": {
        "type": "number",
        "description": "Period (number of candles used) for the exponential moving average",
        "default": 20
      },
      "atrLength": {
        "type": "number",
        "description": "Period (number of candles used) for the average true range",
        "default": 10
      },
      "multiplier": {
        "type": "number",
        "description": "Number of ATRs out from the EMA the bounds should be made",
        "default": 2
      },`
}

export function keltnerLogic(candles: Candle[], configJson: KeltnerConfig): i64[] {
    const lookback = candles.length < configJson.lookback ? candles.length : configJson.lookback;
    const emas = calculateEMA(candles, lookback);
    const ema = emas[emas.length-1];
    // return ema.toString()
  
    const atrLookback = i32(candles.length) < i32(configJson.atrLength) ? candles.length : configJson.atrLength;
  
    // loop through last lookback and get atr
    const atr = calculateATR(candles, atrLookback);
  
    const lowerPrice = ema - (configJson.multiplier * atr);
    const upperPrice = ema + (configJson.multiplier * atr);
  
    const lowerTick = i32(closestDivisibleNumber(i32(Math.round(getTickFromPrice(f64(lowerPrice)))), getTickSpacing(configJson.poolFee), true));
    const upperTick = i32(closestDivisibleNumber(i32(Math.round(getTickFromPrice(f64(upperPrice)))), getTickSpacing(configJson.poolFee), false));
    return [lowerTick, upperTick]
}

// If numCandles is less than period, adjust
export function calculateEMA(data: Candle[], period: i32): f64[] {
    const multiplier = 2.0 / (f64(period) + 1);
    let ema: f64 = 0;
    const emas: f64[] = [];
  
    // Calculate initial EMA
    for (let i = 0; i < period; i++) {
      ema += data[i].close;
    }
    ema /= period;
    emas.push(ema);
  
    // Calculate subsequent EMAs
    for (let i = period; i < data.length; i++) {
      const closePriceToday = data[i].close;
      ema = (multiplier * closePriceToday) + ((1 - multiplier) * ema);
      emas.push(ema);
    }
  
    return emas;
  }
  
  export function calculateATR(data: Candle[], period: i32): f64 {
    const trs: f64[] = [];
    const atrs: f64[] = [];
  
    // Calculate initial true range
    const firstData = data[0];
    let trueRange = firstData.high - firstData.low;
    trs.push(trueRange);
  
    // Calculate subsequent true ranges and ATRs
    for (let i = 1; i < data.length; i++) {
      const previousData = data[i - 1];
      const currentData = data[i];
  
      const tr1 = currentData.high - currentData.low;
      const tr2 = Math.abs(currentData.high - previousData.close);
      const tr3 = Math.abs(currentData.low - previousData.close);
  
      trueRange = Math.max(Math.max(tr1, tr2), tr3);
      trs.push(trueRange);
    }
    // data will be ascending, handle more candles than period
    const startSignificant = trs.length - period
    let sum = trs[startSignificant]
    for (let i = startSignificant + 1; i < trs.length; i++) {
      sum += trs[i]
    }
    const atr = sum / period
  
    return atr;
  }