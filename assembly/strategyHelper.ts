import { getBollingerConfig } from "./bollinger"
import { getClassicConfig } from "./classic"
import { getDonchianConfig } from "./donchian"
import { getKeltnerConfig } from "./keltner"

export const enum StrategyType {
    Donchian,
    Bollinger,
    Keltner,
    Static,
    Classic
}

export function getStrategyEnum(strategy: string): StrategyType {
  if (strategy === 'Donchian Channel') {
      return StrategyType.Donchian;
  } else if (strategy === 'Bollinger Band') {
      return StrategyType.Bollinger;
  } else if (strategy === 'Keltner Channel') {
      return StrategyType.Keltner;
  } else if (strategy === 'Static') {
      return StrategyType.Static;
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
  } else if (strategy === StrategyType.Static) {
      return 'Static';
  } else {
      return 'Classic';
  }
}


export function StrategyConfig(): string {
    return `"strategy": {
        "enum": [
            "Donchian Channel",
            "Bollinger Band",
            "Keltner Channel",
            "Static",
            "Classic"
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
      },
      {
        "if": {
          "properties": {
            "strategy": {
              "const": "Stable"
            }
          }
        },
        "then": {
          "properties": {
            "lowerBound": {
              "title": "Lower Bound",
              "description": "Lower tick of the static range",
              "type": "integer"
            },
            "upperBound": {
              "title": "Upper Bound",
              "description": "Upper tick of the static range",
              "type": "integer"
            }
          },
          "required": [
            "lowerBound",
            "upperBound"
          ]
        }
      }`
}
