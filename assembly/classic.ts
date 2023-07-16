import { getTickSpacing } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { closestDivisibleNumber } from "@steerprotocol/strategy-utils/assembly";

export const enum PlacementOptions {
    Centered,
    Over,
    Under,
}

// function getPlacementNames(placement: PlacementOptions): string {
//     switch (placement) {
//         case PlacementOptions.Over:
//             return 'Position over current price'
//         case PlacementOptions.Under:
//             return 'Position under current price'

//         default:
//             return 'Position centered around current price'
//     }
// }

function getPlacementOptions(placement: string): PlacementOptions {
    if (placement === 'Position over current price') {
        return PlacementOptions.Over;
    } else if (placement === 'Position under current price') {
        return PlacementOptions.Under;
    } else {
        return PlacementOptions.Centered;
    }
}


export class ClassicConfig {
    placementType: string = "Position over current price";
    positionSize: i32 = 600;
    poolFee: i32 = 0;
    constructor (_placementType: string, _positionSize: i32, _poolFee: i32){
        this.placementType = _placementType
        this.positionSize = _positionSize
        this.poolFee = _poolFee
      }
}


export function classicLogic(currentTick: i64, configJson: ClassicConfig): i64[] {

    const placement = getPlacementOptions(configJson.placementType)

    // clean up position size if necessary
    const tickSpacing = getTickSpacing(i32(configJson.poolFee))
    const verifiedPositionSize = i64(closestDivisibleNumber(f64(configJson.positionSize), tickSpacing, true));
    // get nearest initializable tick
    
    const nearestTick = i64(Math.round((f64(currentTick) / f64(tickSpacing) ) * f64(tickSpacing)))
    switch (placement) {
        
        case PlacementOptions.Over:
            return [nearestTick, nearestTick + verifiedPositionSize]
        case PlacementOptions.Under:
            return [nearestTick - verifiedPositionSize, nearestTick]

        default:
            //if odd bins, roll closer
            const numSpaces = (verifiedPositionSize / tickSpacing)
            if (numSpaces % 2 != 0) {
                const gPos = (numSpaces - 1 / 2)
                // roll up if closer
                // const diff = (currentTick - nearestTick)
                if (nearestTick >= currentTick) {
                    //extra goes under
                    return [nearestTick - ((gPos+1) * tickSpacing), nearestTick + (gPos * tickSpacing)]
                }
                else {
                    // extra goes over
                    return [nearestTick - (gPos * tickSpacing), nearestTick + ((gPos+1) * tickSpacing)]
                }
            }
            // else split and return
            const halfDist = verifiedPositionSize / 2
            return [nearestTick - halfDist, nearestTick + halfDist]
    }
}

export function getClassicConfig(): string {
    return `    "placementType": {
        "type": "string",
        "enum": [
          "Position centered around current price",
          "Position over current price",
          "Position under current price"
        ]
      },
      "positionSize": {
        "type": "integer",
        "title": "Size of Position in ticks (BPS)"
      },`
}