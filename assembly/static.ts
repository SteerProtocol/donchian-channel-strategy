import { getTickSpacing } from "@steerprotocol/concentrated-liquidity-strategy";
import { closestDivisibleNumber } from "@steerprotocol/strategy-utils";

export class StaticConfig {
    poolFee: i32 = 0;
    lowerBound: i32 = 0;
    upperBound: i32 = 0;
    constructor(_pool: i32, _lower: i32, _upper: i32){
        this.poolFee = _pool;
        this.lowerBound = _lower;
        this.upperBound = _upper;
    }
}

export function staticLogic(configJson: StaticConfig) : i32[] {
    
    const lowerTick = i32(closestDivisibleNumber(i32(configJson.lowerBound), getTickSpacing(configJson.poolFee), true));
    const upperTick = i32(closestDivisibleNumber(i32(configJson.upperBound), getTickSpacing(configJson.poolFee), true));
    return [lowerTick, upperTick]
}