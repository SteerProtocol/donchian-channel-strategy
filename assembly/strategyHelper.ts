import { getBollingerConfig } from "./bollinger"
import { getClassicConfig } from "./classic"
import { getDonchianConfig } from "./donchian"
import { getKeltnerConfig } from "./keltner"

export const enum StrategyType {
    Donchian,
    Bollinger,
    Keltner,
    // Stable,
    Classic
}

export function getStrategyEnum(strategy: string): StrategyType {
  if (strategy === 'Donchian Channel') {
      return StrategyType.Donchian;
  } else if (strategy === 'Bollinger Band') {
      return StrategyType.Bollinger;
  } else if (strategy === 'Keltner Channel') {
      return StrategyType.Keltner;
  // } else if (strategy === 'Static Stable') {
  //     return StrategyType.Stable;
  } else {
      return StrategyType.Classic;
  }
}

export function getStrategyName(strategy: StrategyType): string {
  if (strategy === StrategyType.Donchian) {
      return 'Donchian Channel';
  } else if (strategy === StrategyType.Bollinger) {
      return 'Bollinger Band';
  } else if (strategy === StrategyType.Keltner) {
      return 'Keltner Channel';
  // } else if (strategy === StrategyType.Stable) {
  //     return 'Static Stable';
  } else {
      return 'Classic';
  }
}


export function StrategyConfig(): string {
    return `"strategy": {
        "enum": [
            'Donchian Channel',
            'Bollinger Band',
            'Keltner Channel',
            'Classic'
        ],
        "title": "Strategy Type",
        "type": "string",
        "default": "Classic"
      }`
}

export function allOfStrategy(): string {
    return `{
        "if": {
          "properties": {
            "strategy": {
              "const": "Donchian Channel"
            }
          }
        },
        "then": {
          "properties": {
            ${getDonchianConfig()}
          },
          "required": [
            "lookback",
            "multiplier"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "strategy": {
              "const": "Bollinger Band"
            }
          }
        },
        "then": {
          "properties": {
            ${getBollingerConfig()}
          },
          "required": [
            "period",
            "standardDeviations"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "strategy": {
              "const": "Keltner Channel"
            }
          }
        },
        "then": {
          "properties": {
            ${getKeltnerConfig()}
          },
          "required": [
            "lookback",
            "atrLength",
            "multiplier"
          ]
        }
      },
      {
        "if": {
          "properties": {
            "strategy": {
              "const": "Classic"
            }
          }
        },
        "then": {
          "properties": {
            ${getClassicConfig()}
          },
          "required": [
            "placementType",
            "positionSize"
          ]
        }
      }`
}
