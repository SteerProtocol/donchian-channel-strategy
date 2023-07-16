import { getTickSpacing } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { closestDivisibleNumber } from "@steerprotocol/strategy-utils/assembly";

export const enum PlacementOptions {
    Centered,
    Over,
    Under,
}

function getPlacementNames(placement: PlacementOptions): string {
    switch (placement) {
        case PlacementOptions.Over:
            return 'Position over current price'
        case PlacementOptions.Under:
            return 'Position under current price'

        default:
            return 'Position centered around current price'
    }
}

function getPlacementOptions(placement: string): PlacementOptions {
    switch (placement) {
        case 'Position over current price':
            return PlacementOptions.Over
        case 'Position under current price':
            return PlacementOptions.Under
    
        default:
            return PlacementOptions.Centered
    }
}

class ClassicConfig {
    placementType: string = "Position over current price";
    positionSize: i64 = 600;
    poolFee: i64 = 0;
}


export function classicLogic(currentTick: i64, configJson: ClassicConfig): i64[] {

    const placement = getPlacementOptions(configJson.placementType)

    // clean up position size if necessary
    const tickSpacing = getTickSpacing(configJson.poolFee)
    const verifiedPositionSize = i64(closestDivisibleNumber(configJson.positionSize, tickSpacing, true));
    // get nearest initializable tick
    
    const nearestTick = Math.round((f64(currentTick) / f64(tickSpacing) ) * f64(tickSpacing))
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