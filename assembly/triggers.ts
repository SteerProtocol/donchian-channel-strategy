import { CurvesConfigHelper } from "@steerprotocol/concentrated-liquidity-strategy/assembly";
import { Position } from "@steerprotocol/strategy-utils/assembly";
import { JSON } from "json-as";

// NOTE: Trigger functions return true when action should be taken, if false then the strategy can return 'continue' to skip exeuction

// Gets active range from the output of LM.getPositions()
export function parseActiveRange(_positions: string): Position {
    // _positions will be '[[#,#,#],[#,#,#],[#,#,#]]' presumably. lower, upper, weight
    // clean up our list by removing spaces and brackets
    let positions = _positions.replaceAll(' ','');
    positions = positions.replaceAll('[','');
    let rangeArray = positions.split(']',2);
    let startTick = rangeArray[0].split(',')[0];
    let endRange = rangeArray[1].split(']',2);
    const endTicks = endRange[0].split(',');
    let endTick = endTicks[endTicks.length-1]
    // if trailing comma
    if (endTick == '') endTick = endTicks[endTicks.length-2]
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

export function emptyCurrentPosition(currentPosition: Position): boolean {
    // return true if current position ticks are not the same
    return currentPosition.startTick == currentPosition.endTick
}

// where rebalance width is how far off on either side the trigger should activate
export function triggerFromDistance(currentPosition: Position, rebalanceWidth: i64, currentTick: i64): boolean {
    if (emptyCurrentPosition(currentPosition)) return true
    const centerPosition = (currentPosition.endTick + currentPosition.startTick) / 2
    const upperTrigger = centerPosition + (rebalanceWidth)
    const lowerTrigger = centerPosition - (rebalanceWidth)
    // In bounds? return false to continue (skip exec), returns true to execute
    return !((currentTick <= upperTrigger && currentTick >= lowerTrigger))
}

// tick moves % away from center of position range
export function triggerFromPercentage(currentPosition: Position, rebalancePercentage: f64, currentTick: i64): boolean {
    if (emptyCurrentPosition(currentPosition)) return true
    const side = (currentPosition.endTick - currentPosition.startTick) / 2
    const centerPosition = (currentPosition.endTick + currentPosition.startTick) / 2
    const triggerDiff = i64(Math.round(f64(side) * rebalancePercentage))
    const upperTrigger = centerPosition + triggerDiff
    const lowerTrigger = centerPosition - triggerDiff
    // In bounds? return false to continue (skip exec), returns true to execute
    return !((currentTick <= upperTrigger && currentTick >= lowerTrigger))
}

// when current tick is no longer in the current position range
export function triggerPositionsInactive(currentPosition: Position, currentTick: i64): boolean {
    if (emptyCurrentPosition(currentPosition)) return true
    return !((currentTick <= currentPosition.endTick && currentTick >= currentPosition.startTick))
}

// when tick goes over or under specified tick, trigger rebalance
// export function triggerFromSpecifiedPrice(triggerTick: i64, currentTick: i64, triggerOver: boolean): boolean {
//     // if trigger over, return true when currentTick > triggerTick
//     if (triggerOver) {
//         return currentTick > triggerTick
//     }
//     // trigger under, if current price is less than trigger tick return true
//     return triggerTick > currentTick
// }

// when tick goes over or under current positions, trigger rebalance, only moves one way
export function triggerPricePastPositions(currentPosition: Position, currentTick: i64, triggerOver: boolean): boolean {
    if (emptyCurrentPosition(currentPosition)) return true
    if (triggerOver) {
        // if the currentTick is over the endTick, rebal
        return currentTick > currentPosition.endTick
    }
    // if current tick is under start tick
    return currentTick < currentPosition.startTick
}

export const enum TriggerStyle {
    DistanceFromCenterOfPositions,
    PercentageChangeFromPositionRange,
    PositionsInactive,
    // SpecificPrice,
    PricePastPositions,
    None,
}

export function TriggerStyleLookup(triggerStyle: TriggerStyle): string {
    switch (triggerStyle) {
        case TriggerStyle.DistanceFromCenterOfPositions:
            return "Distance from center of position(s)";
        case TriggerStyle.PercentageChangeFromPositionRange:
            return "Percentage of position(s)";
        case TriggerStyle.PositionsInactive:
            return "Positions Inactive";
        // case TriggerStyle.SpecificPrice:
        //     return "Specific Price";
        case TriggerStyle.PricePastPositions:
            return "Price moved past position(s)";
        case TriggerStyle.None:
          return 'None'

    default:
        throw new Error(`Unknown trigger style: ${triggerStyle}`);
    }
}

export class DistanceFromCenterOfPositionsOptions {
    tickDistanceFromCenter: i64 = 0;
    requiredDataTypes: string[] = ['Liquidity Manager Positions', 'V3 Pool Current Tick'];
}

export class PercentageChangeFromPositionRangeOptions {
    percentageOfPositionRangeToTrigger: f64 = 0.0;
    requiredDataTypes: string[] = ['Liquidity Manager Positions', 'V3 Pool Current Tick'];
}

export class PositionsInactiveOptions {
    requiredDataTypes: string[] = ['Liquidity Manager Positions', 'V3 Pool Current Tick'];
}

// export class SpecificPriceOptions {
//     tickPriceTrigger: i64 = 0;
//     triggerWhenOver: boolean = false;
//     requiredDataTypes: string[] = ['V3 Pool Current Tick'];
// }

export class PricePastPositionsOptions {
    triggerWhenOver: boolean = false;
    requiredDataTypes: string[] = ['Liquidity Manager Positions', 'V3 Pool Current Tick'];
}

export class TriggerConfigHelper extends CurvesConfigHelper {
    triggerType: TriggerStyle = TriggerStyle.PositionsInactive;
    triggerWhenOver: boolean = false;
    tickPriceTrigger: i64 = 0;
    percentageOfPositionRangeToTrigger: f64 = 0.0;
    tickDistanceFromCenter: i64 = 0;
    elapsedTendTime: i64 = 0;
}

// no AS func overloading yet :(
// export function shouldTriggerExecution_1(triggerStyle: TriggerStyle, triggerOptions: TriggerConfigHelper, dataConnector1: string) : boolean {
//     // parse options
//     switch (triggerStyle) {
//         case TriggerStyle.SpecificPrice:
//             // parse current tick from dc1
//             const currentTick = parseInt(dataConnector1)
//             if (!currentTick) return true
//             // tick and over
//             return triggerFromSpecifiedPrice(triggerOptions.tickPriceTrigger, currentTick, triggerOptions.triggerWhenOver)
//         default:
//             return true
//     }
// }

export function shouldTriggerExecution(triggerStyle: TriggerStyle, triggerOptions: TriggerConfigHelper, dataConnector1: string, dataConnector2: string, dataConnector3: string) : boolean {

    // possible dc inputs
    let currentPositionRange: Position;
    let currentTick: i64;

    // auto trigger if we are overdue
    const timeSinceLastExecution = parseInt(dataConnector3)
    if (timeSinceLastExecution >= triggerOptions.elapsedTendTime) return true

    switch (triggerStyle) {
        case TriggerStyle.DistanceFromCenterOfPositions:
            // parse ulm positions [0], current tick [1]
            currentPositionRange = parseActiveRange(dataConnector1)
            currentTick = parseInt(dataConnector2)
            if (!currentTick) return true
            return triggerFromDistance(currentPositionRange, triggerOptions.tickDistanceFromCenter, currentTick)

        case TriggerStyle.PercentageChangeFromPositionRange:
            // parse ulm positions [0], current tick [1]
            currentPositionRange= parseActiveRange(dataConnector1)
            currentTick = parseInt(dataConnector2)
            if (!currentTick) return true
            return triggerFromPercentage(currentPositionRange, triggerOptions.percentageOfPositionRangeToTrigger, currentTick)

        case TriggerStyle.PositionsInactive:
            // parse ulm positions [0], current tick [1]
            currentPositionRange = parseActiveRange(dataConnector1)
            currentTick = parseInt(dataConnector2)
            if (!currentTick) return true
            return triggerPositionsInactive(currentPositionRange, currentTick)

        case TriggerStyle.PricePastPositions:
            // parse ulm positions [0], current tick [1]
            currentPositionRange = parseActiveRange(dataConnector1)
            currentTick = parseInt(dataConnector2)
            if (!currentTick) return true
            return triggerPricePastPositions(currentPositionRange, currentTick,  triggerOptions.triggerWhenOver)
        default:
            return true
    }
}

// Find TriggerStyle from string
export function getTriggerStyle(trigger: string): TriggerStyle {
    switch (trigger) {
        case 'Current Price set distance from center of positions':
            return TriggerStyle.DistanceFromCenterOfPositions
        case 'Price leaves active range':
            return TriggerStyle.PositionsInactive
        case 'Price moves percentage of active range away':
            return TriggerStyle.PercentageChangeFromPositionRange
        case 'Price moves one way past positions':
            return TriggerStyle.PricePastPositions
    
        default:
            return TriggerStyle.None
    }
}

// Find string from TriggerStyle
function getTriggerName(trigger: TriggerStyle): string {
    switch (trigger) {
        case TriggerStyle.DistanceFromCenterOfPositions:
            return  'Current Price set distance from center of positions'
        case TriggerStyle.PositionsInactive:
            return  'Price leaves active range'
        case TriggerStyle.PercentageChangeFromPositionRange:
            return  'Price moves percentage of active range away'
        case TriggerStyle.PricePastPositions:
            return  'Price moves one way past positions'
    
        default:
            return 'None'
    }
}

export function triggerPropertyHelper(omit: TriggerStyle[] = []): string {
    const triggerList = [
        TriggerStyle.DistanceFromCenterOfPositions,
        TriggerStyle.None,
        TriggerStyle.PercentageChangeFromPositionRange,
        TriggerStyle.PositionsInactive,
        TriggerStyle.PricePastPositions,
    ];

    const filteredTriggers: string[] = [];
    for(let trigger = 0; trigger < triggerList.length; trigger++){
      if (!omit.includes(  triggerList[trigger])) {
        filteredTriggers.push(getTriggerName(triggerList[trigger]));
      }
    }

    return `"triggerStyle": {
      "enum": ${JSON.stringify(triggerList)},
      "title": "Logic to trigger new positions",
      "type": "string",
      "default": "None"
    }`;
  }

  export function allOfTrigger(): string {
    return `{
    "if": {
      "properties": {
        "triggerStyle": {
          "const": "None"
        }
      }
    },
    "then": {
      "properties": {},
      "required": []
    }
  },
  {
    "if": {
      "properties": {
        "triggerStyle": {
          "const": "Current Price set distance from center of positions"
        }
      }
    },
    "then": {
      "properties": {
        "tickDistanceFromCenter": {
            "type": "integer",
            "title": "Tick Distance",
            "description": "The number of ticks (basis points) from center price of positions to trigger setting new positions"
        }
      },
      "required": [tickDistanceFromCenter]
    }
  },
  {
    "if": {
      "properties": {
        "triggerStyle": {
          "const": "Price leaves active range"
        }
      }
    },
    "then": {
      "properties": {},
      "required": []
    }
  },
  {
    "if": {
      "properties": {
        "triggerStyle": {
          "const": "Price moves percentage of active range away"
        }
      }
    },
    "then": {
      "properties": {
        "percentageOfPositionRangeToTrigger": {
            "type": "number",
            "title": "Percentage of Range",
            "description": "The percentage of the range away to trigger new positions, 100% or 1 would be at the bounds of the range"
        }
      },
      "required": [percentageOfPositionRangeToTrigger]
    }
  },,
  {
    "if": {
      "properties": {
        "triggerStyle": {
          "const": "Price moves one way past positions"
        }
      }
    },
    "then": {
      "properties": {
        "triggerWhenOver": {
            "type": "boolean",
            "title": "Price Moves Higher",
            "description": "True for if the strategy should set new positions when the price (tick) is higher than the current positions, false for lower"
        }
      },
      "required": [triggerWhenOver]
    }
  }`;
}