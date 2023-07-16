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

export function getStrategyEnum(strategy: string) : StrategyType {
    switch (strategy) {
        case 'Donchian Channel':
            return StrategyType.Donchian
        case 'Bollinger Band':
            return StrategyType.Bollinger
        case 'Keltner Channel':
            return StrategyType.Keltner
        // case 'Static Stable':
        //     return StrategyType.Stable
        default:
            return StrategyType.Classic
    }
}

export function getStrategyName(strategy: StrategyType): string {
    switch (strategy) {
        case StrategyType.Donchian :
            return 'Donchian Channel'
        case StrategyType.Bollinger :
            return 'Bollinger Band'
        case StrategyType.Keltner:
            return  'Keltner Channel'
        // case StrategyType.Stable:
        //     return  'Static Stable'
        default:
            return 'Classic'
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
