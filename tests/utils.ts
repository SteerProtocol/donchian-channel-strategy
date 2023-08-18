

export const donchian_config = `{
  "elapsedTendTime": 604800,
  "triggerStyle": "None",
  "strategy": "Donchian Channel",
  "liquidityShape": "Linear",
  "lookback": 12,
  "multiplier": 1.7,
  "poolFee": 3000,
  "bins": 3
}`

export const config = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Strategy Config",
  "type": "object",
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
    "lookback": {
      "type": "number",
      "title": "Channel Lookback",
      "description": "Lookback period for channel",
      "detailedDescription": "Number of candles to use for the channel",
      "default": 5
    },
    "multiplier": {
      "type": "number",
      "title": "Channel Multiplier",
      "description": "Multiplier for channel width",
      "detailedDescription": "Example: 5% channel width = 1.05",
      "default": 1
    },
    "triggerStyle": {
      "enum": [
        "Current Price set distance from center of positions",
        "Price leaves active range",
        "Price moves percentage of active range away",
        "Price moves one way past positions",
        "None"
      ],
      "title": "Logic to trigger new positions",
      "type": "string",
      "default": "None"
    },
    "liquidityShape": {
      "enum": [
        "Normalized",
        "Absolute",
        "Linear",
        "Sigmoid",
        "PowerLaw",
        "Sine",
        "Triangle",
        "Quadratic",
        "Logarithmic"
      ],
      "title": "Liquidity Shape",
      "type": "string",
      "default": "Linear"
    }
  },
  "allOf": [
    {
      "if": {
        "properties": {
          "triggerStyle": {
            "const": "None"
          }
        }
      },
      "then": {
        "properties": {
          "expectedDataTypes": {
            "const": [
              "OHLC"
            ],
            "default": [
              "OHLC"
            ],
            "hidden": true,
            "type": "string"
          }
        },
        "required": [
          "expectedDataTypes"
        ]
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
            "description": "The number of ticks (basis points) from center price of positions to trigger setting new positions",
            "detailedDescription": "The static number of ticks from the center of the active range to trigger: if our position goes from 0-100, and we have a tick distance of 75, we will go out 75 ticks both ways from the center of our positions (50). This means we will skip execution only if the current tick is between -25 and 125. Future positions will determine where the center of the trigger range is located."
          },
          "expectedDataTypes": {
            "const": [
              "OHLC",
              "Liquidity Manager Positions",
              "V3 Pool Current Tick",
              "Time Since Last Execution"
            ],
            "default": [
              "OHLC",
              "Liquidity Manager Positions",
              "V3 Pool Current Tick",
              "Time Since Last Execution"
            ],
            "hidden": true,
            "type": "string"
          },
          "elapsedTendTime": {
            "type": "number",
            "title": "Max time between tends",
            "description": "If trigger conditions have not been met for this period of time, the strategy will execute regardless of trigger logic to update vault accounting.",
            "default": 1209600
          }
        },
        "required": [
          "tickDistanceFromCenter",
          "expectedDataTypes",
          "elapsedTendTime"
        ]
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
        "properties": {
          "expectedDataTypes": {
            "const": [
              "OHLC",
              "Liquidity Manager Positions",
              "V3 Pool Current Tick",
              "Time Since Last Execution"
            ],
            "default": [
              "OHLC",
              "Liquidity Manager Positions",
              "V3 Pool Current Tick",
              "Time Since Last Execution"
            ],
            "hidden": true,
            "type": "string"
          },
          "elapsedTendTime": {
            "type": "number",
            "title": "Max time between tends",
            "description": "If trigger conditions have not been met for this period of time, the strategy will execute regardless of trigger logic to update vault accounting.",
            "default": 1209600
          }
        },
        "required": [
          "expectedDataTypes",
          "elapsedTendTime"
        ]
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
            "description": "The percentage of the range away to trigger new positions, 100% or 1 would be at the bounds of the range",
            "detailedDescription": "If you have a simple position ranging from ticks 0 - 100, and you set this value to 1, the trigger range will be the outer bounds. Using 0.5 would make the trigger range 25-75, 2 would make the range -50 - 150."
          },
          "expectedDataTypes": {
            "const": [
              "OHLC",
              "Liquidity Manager Positions",
              "V3 Pool Current Tick",
              "Time Since Last Execution"
            ],
            "default": [
              "OHLC",
              "Liquidity Manager Positions",
              "V3 Pool Current Tick",
              "Time Since Last Execution"
            ],
            "hidden": true,
            "type": "string"
          },
          "elapsedTendTime": {
            "type": "number",
            "title": "Max time between tends",
            "description": "If trigger conditions have not been met for this period of time, the strategy will execute regardless of trigger logic to update vault accounting.",
            "default": 1209600
          }
        },
        "required": [
          "percentageOfPositionRangeToTrigger",
          "expectedDataTypes",
          "elapsedTendTime"
        ]
      }
    },
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
            "description": "True for if the strategy should set new positions when the price (tick) is higher than the current positions, false for lower",
            "detailedDescription": "If our current position ranges from ticks 0 - 100, true will make our bundle execute only when the current tick is higher. Any other case (current tick less than 100) will result in a continue recommendation."
          },
          "expectedDataTypes": {
            "const": [
              "OHLC",
              "Liquidity Manager Positions",
              "V3 Pool Current Tick",
              "Time Since Last Execution"
            ],
            "default": [
              "OHLC",
              "Liquidity Manager Positions",
              "V3 Pool Current Tick",
              "Time Since Last Execution"
            ],
            "hidden": true,
            "type": "string"
          },
          "elapsedTendTime": {
            "type": "number",
            "title": "Max time between tends",
            "description": "If trigger conditions have not been met for this period of time, the strategy will execute regardless of trigger logic to update vault accounting.",
            "default": 1209600
          }
        },
        "required": [
          "triggerWhenOver",
          "expectedDataTypes",
          "elapsedTendTime"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Linear"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "reflect": {
            "title": "Reflect Curve Over Y-Axis",
            "type": "boolean"
          }
        },
        "required": [
          "bins",
          "reflect"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Normalized"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "stdDev": {
            "type": "number",
            "title": "Standard Deviation",
            "description": "The value to use as the standard deviation when forming the Gaussian curve.",
            "detailedDescription": "The value in ticks representing the average distance from the center of the curve. Increasing this value will increase the spread or coverage of the curve.",
            "default": 5
          },
          "invert": {
            "title": "Invert Curve Over X-Axis",
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "bins",
          "stdDev"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "ExponentialDecay"
          }
        }
      },
      "then": {
        "properties": {
          "rate": {
            "type": "number",
            "title": "Rate",
            "description": "The decay constant, related to the half-life of the substance",
            "detailedDescription": "The higher the rate, the faster the decay of quantity, giving a more dramatic and steep curve."
          }
        },
        "required": [
          "rate"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Sigmoid"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "k": {
            "type": "number",
            "title": "Slope (k)",
            "default": 5,
            "description": "The slope of the curve or the steepness of the sigmoid function."
          },
          "reflect": {
            "title": "Reflect Curve Over Y-Axis",
            "type": "boolean",
            "default": false
          },
          "invert": {
            "title": "Invert Curve Over X-Axis",
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "bins",
          "k",
          "reflect"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Logarithmic"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "base": {
            "type": "number",
            "title": "Base",
            "description": "The base of the logarithm.",
            "detailedDescription": "Increasing this value will give the curve a sharper angle and flatten out sooner. ",
            "default": 2
          },
          "reflect": {
            "title": "Reflect Curve Over Y-Axis",
            "type": "boolean",
            "default": false
          },
          "invert": {
            "title": "Invert Curve Over X-Axis",
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "bins",
          "base"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "PowerLaw"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "exponent": {
            "type": "number",
            "title": "Exponent",
            "description": "The exponent of the power law",
            "detailedDescription": "The inverse of this value is applied to the x value, larger values will lead to steeper curves.",
            "default": 2
          },
          "reflect": {
            "title": "Reflect Curve Over Y-Axis",
            "type": "boolean",
            "default": false
          },
          "invert": {
            "title": "Invert Curve Over X-Axis",
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "bins",
          "exponent",
          "reflect"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Step"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "threshold": {
            "type": "number",
            "title": "Threshold"
          }
        },
        "required": [
          "bins",
          "threshold"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Sine"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "amplitude": {
            "type": "number",
            "title": "Amplitude",
            "default": 1,
            "description": "The amplitude determines the maximum height of the sine curve. Larger numbers will result in more dramatic highs.",
            "detailedDescription": "The amplitude determines the maximum height of the sine curve. Larger numbers will result in more dramatic highs."
          },
          "frequency": {
            "type": "number",
            "title": "Frequency",
            "default": 0.5,
            "description": "The frequency determines the number of cycles (complete oscillations) the sine curve completes in one unit of distance along the x-axis. In the case of frequency 1, the sine curve completes one full cycle in one unit of distance along the x-axis.",
            "detailedDescription": "The frequency determines the number of cycles (complete oscillations) the sine curve completes in one unit of distance along the x-axis. In the case of frequency 1, the sine curve completes one full cycle in one unit of distance along the x-axis."
          },
          "phase": {
            "type": "number",
            "title": "Phase",
            "default": 0,
            "description": "The phase represents a horizontal shift of the sine curve. When the phase is 0, the curve starts at its highest point (the peak).",
            "detailedDescription": "The phase represents a horizontal shift of the sine curve. When the phase is 0, the curve starts at its highest point (the peak)."
          }
        },
        "required": [
          "bins",
          "amplitude",
          "frequency",
          "phase"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Triangle"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "amplitude": {
            "type": "number",
            "title": "Amplitude",
            "description": "The height of the triangle given on the y-axis.",
            "detailedDescription": "The amplitude of a triangle wave refers to the distance from the baseline (midpoint) of the wave to its peak (or trough). It represents the maximum deviation of the waveform from its average value."
          },
          "period": {
            "type": "number",
            "title": "Period",
            "description": "The distance taken to complete a single cycle of the triangle pattern.",
            "detailedDescription": "The period of a triangle wave is the time it takes for the wave to complete one full cycle. In other words, it's the distance along the time axis between two consecutive points that correspond to identical positions in the waveform."
          },
          "phase": {
            "type": "number",
            "title": "Phase",
            "description": "X-axis offset to the waveform cycle.",
            "detailedDescription": "Phase refers to the position of a waveform within its cycle at a specific point in time."
          }
        },
        "required": [
          "bins",
          "amplitude",
          "period",
          "phase"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Quadratic"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "a": {
            "type": "number",
            "title": "A",
            "default": 1,
            "description": "Ref: ax^2 + bx + c"
          },
          "b": {
            "type": "number",
            "title": "B",
            "default": 1,
            "description": "Ref: ax^2 + bx + c"
          },
          "c": {
            "type": "number",
            "title": "C",
            "default": 1,
            "description": "Ref: ax^2 + bx + c"
          },
          "reflect": {
            "title": "Reflect Curve Over Y-Axis",
            "type": "boolean",
            "default": false
          },
          "invert": {
            "title": "Invert Curve Over X-Axis",
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "bins",
          "a",
          "b",
          "c"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Cubic"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "a": {
            "type": "number",
            "title": "A",
            "default": 1,
            "description": "Ref: ax^3 + bx^2 + cx + d"
          },
          "b": {
            "type": "number",
            "title": "B",
            "default": 1,
            "description": "Ref: ax^3 + bx^2 + cx + d"
          },
          "c": {
            "type": "number",
            "title": "C",
            "default": 1,
            "description": "Ref: ax^3 + bx^2 + cx + d"
          },
          "d": {
            "type": "number",
            "title": "D",
            "default": 1,
            "description": "Ref: ax^3 + bx^2 + cx + d"
          },
          "reflect": {
            "title": "Reflect Curve Over Y-Axis",
            "type": "boolean",
            "default": false
          },
          "invert": {
            "title": "Invert Curve Over X-Axis",
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "bins",
          "a",
          "b",
          "c",
          "d"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "ExponentialGrowth"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "rate": {
            "type": "number",
            "title": "Rate"
          }
        },
        "required": [
          "bins",
          "rate"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "LogarithmicDecay"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "rate": {
            "type": "number",
            "title": "Rate"
          },
          "base": {
            "type": "number",
            "title": "Base"
          }
        },
        "required": [
          "bins",
          "rate",
          "base"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "Sawtooth"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "amplitude": {
            "type": "number",
            "title": "Amplitude"
          },
          "period": {
            "type": "number",
            "title": "Period"
          },
          "phase": {
            "type": "number",
            "title": "Phase"
          }
        },
        "required": [
          "bins",
          "amplitude",
          "period",
          "phase"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "liquidityShape": {
            "const": "SquareWave"
          }
        }
      },
      "then": {
        "properties": {
          "bins": {
            "type": "number",
            "title": "Positions",
            "description": "The max number of positions the strategy will make to achieve the desired curve.",
            "detailedDescription": "The strategy will attempt to make this number of positions, but can be limited by available range and pool spacing"
          },
          "amplitude": {
            "type": "number",
            "title": "Amplitude"
          },
          "period": {
            "type": "number",
            "title": "Period"
          },
          "phase": {
            "type": "number",
            "title": "Phase"
          }
        },
        "required": [
          "bins",
          "amplitude",
          "period",
          "phase"
        ]
      }
    },
    {
      "required": [
        "liquidityShape"
      ]
    }
  ]
}`;

export const empty = '{"data":[]}';

export const prices = [
  {
    "timestamp": 1620248400000,
    "high": 3.0482211045024987e-12,
    "low": 3.0420331741444116e-12,
    "close": 3.0482211045024987e-12,
    "open": 3.0420331741444116e-12
  },
  {
    "timestamp": 1620249300000,
    "high": 3.052443706603611e-12,
    "low": 3.051083443544758e-12,
    "close": 3.052443706603611e-12,
    "open": 3.051083443544758e-12
  },
  {
    "timestamp": 1620250200000,
    "high": 3.058971994885798e-12,
    "low": 3.053301697638979e-12,
    "close": 3.058971994885798e-12,
    "open": 3.053301697638979e-12
  },
  {
    "timestamp": 1620251100000,
    "high": 3.0619150435330332e-12,
    "low": 3.0591052152995406e-12,
    "close": 3.0619150435330332e-12,
    "open": 3.0591052152995406e-12
  },
  {
    "timestamp": 1620252000000,
    "high": 3.062551448212578e-12,
    "low": 3.0624942591314255e-12,
    "close": 3.062551448212578e-12,
    "open": 3.0624942591314255e-12
  },
  {
    "timestamp": 1620252900000,
    "high": 3.0777357130785475e-12,
    "low": 3.0642196617996214e-12,
    "close": 3.064368586375334e-12,
    "open": 3.0642196617996214e-12
  },
  {
    "timestamp": 1620253800000,
    "high": 3.0569112254326672e-12,
    "low": 3.0569112254326672e-12,
    "close": 3.0569112254326672e-12,
    "open": 3.0569112254326672e-12
  },
  {
    "timestamp": 1620254700000,
    "high": 3.053931783734179e-12,
    "low": 3.0317150735664757e-12,
    "close": 3.0317150735664757e-12,
    "open": 3.053931783734179e-12
  },
  {
    "timestamp": 1620255600000,
    "high": 3.0372917675150144e-12,
    "low": 3.0372917675150144e-12,
    "close": 3.0372917675150144e-12,
    "open": 3.0372917675150144e-12
  },
  {
    "timestamp": 1620256500000,
    "high": 3.0386120996797003e-12,
    "low": 3.0386120996797003e-12,
    "close": 3.0386120996797003e-12,
    "open": 3.0386120996797003e-12
  },
  {
    "timestamp": 1620261000000,
    "high": 3.0404990351591258e-12,
    "low": 3.0404990351591258e-12,
    "close": 3.0404990351591258e-12,
    "open": 3.0404990351591258e-12
  },
  {
    "timestamp": 1620261900000,
    "high": 3.0547701056451405e-12,
    "low": 3.0429306594344523e-12,
    "close": 3.0547701056451405e-12,
    "open": 3.0429306594344523e-12
  },
  {
    "timestamp": 1620262800000,
    "high": 3.0737543374303936e-12,
    "low": 3.0737543374303936e-12,
    "close": 3.0737543374303936e-12,
    "open": 3.0737543374303936e-12
  },
  {
    "timestamp": 1620264600000,
    "high": 3.0770023498727197e-12,
    "low": 3.074909951263263e-12,
    "close": 3.0770023498727197e-12,
    "open": 3.074909951263263e-12
  },
  {
    "timestamp": 1620265500000,
    "high": 3.076334560147718e-12,
    "low": 3.076334560147718e-12,
    "close": 3.076334560147718e-12,
    "open": 3.076334560147718e-12
  }
]

export const candles2 = [
  {
    "timestamp": 1620248400000,
    "high": 57334,
    "low": 57276,
    "close": 57276,
    "open": 57334,
    },
    {
    "timestamp": 1620249300000,
    "high": 57249,
    "low": 57236,
    "close": 57236,
    "open": 57249,
    },
    {
    "timestamp": 1620250200000,
    "high": 57228,
    "low": 57175,
    "close": 57175,
    "open": 57228,
    },
    {
    "timestamp": 1620251100000,
    "high": 57174,
    "low": 57148,
    "close": 57148,
    "open": 57174,
    },
    {
    "timestamp": 1620252000000,
    "high": 57142,
    "low": 57142,
    "close": 57142,
    "open": 57142,
    },
    {
    "timestamp": 1620252900000,
    "high": 57126,
    "low": 570012,
    "close": 57125,
    "open": 57126,
    }
]

export const prices3 = [
  {
    timestamp: 1620248400000,
    high: 573.3476371851107,
    low: 572.7653897862947,
    close: 572.7653897862947,
    open: 573.3476371851107,
  },
  {
    timestamp: 1620249300000,
    high: 572.4966600947654,
    low: 572.3690847959957,
    close: 572.3690847959957,
    open: 572.4966600947654,
  },
  {
    timestamp: 1620250200000,
    high: 572.2886600465616,
    low: 571.757999416375,
    close: 571.757999416375,
    open: 572.2886600465616,
  },
  {
    timestamp: 1620251100000,
    high: 571.745549588537,
    low: 571.4831524457645,
    close: 571.4831524457645,
    open: 571.745549588537,
  },
  {
    timestamp: 1620252000000,
    high: 571.4291070205617,
    low: 571.423771655803,
    close: 571.423771655803,
    open: 571.4291070205617,
  },
  {
    timestamp: 1620252900000,
    high: 571.2682040427187,
    low: 570.0124454515138,
    close: 571.2543224050862,
    open: 571.2682040427187,
  },
  {
    timestamp: 1620253800000,
    high: 571.950687856295,
    low: 571.950687856295,
    close: 571.950687856295,
    open: 571.950687856295,
  },
  {
    timestamp: 1620254700000,
    high: 574.32247048919,
    low: 572.229619806987,
    close: 574.32247048919,
    open: 572.229619806987,
  },
  {
    timestamp: 1620255600000,
    high: 573.7949788294341,
    low: 573.7949788294341,
    close: 573.7949788294341,
    open: 573.7949788294341,
  },
  {
    timestamp: 1620256500000,
    high: 573.6703031128156,
    low: 573.6703031128156,
    close: 573.6703031128156,
    open: 573.6703031128156,
  },
  {
    timestamp: 1620261000000,
    high: 573.4922654231464,
    low: 573.4922654231464,
    close: 573.4922654231464,
    open: 573.4922654231464,
  },
  {
    timestamp: 1620261900000,
    high: 573.2630790607755,
    low: 572.1510958054668,
    close: 572.1510958054668,
    open: 573.2630790607755,
  },
  {
    timestamp: 1620262800000,
    high: 570.381489136757,
    low: 570.381489136757,
    close: 570.381489136757,
    open: 570.381489136757,
  },
  {
    timestamp: 1620264600000,
    high: 570.2742985701099,
    low: 570.0803689046074,
    close: 570.0803689046074,
    open: 570.2742985701099,
  },
  {
    timestamp: 1620265500000,
    high: 570.1422401263446,
    low: 570.1422401263446,
    close: 570.1422401263446,
    open: 570.1422401263446,
  },
  {
    timestamp: 1620266400000,
    high: 572.8052512272116,
    low: 572.8052201233321,
    close: 572.8052512272116,
    open: 572.8052201233321,
  },
  {
    timestamp: 1620267300000,
    high: 572.7730922927839,
    low: 572.7447581107978,
    close: 572.7447581107978,
    open: 572.7730922927839,
  },
  {
    timestamp: 1620268200000,
    high: 572.7272428903487,
    low: 572.7258230151764,
    close: 572.7258230151764,
    open: 572.7272428903487,
  },
  {
    timestamp: 1620270900000,
    high: 572.2594215468664,
    low: 571.8195591664584,
    close: 571.8195591664584,
    open: 572.2578671930029,
  },
  {
    timestamp: 1620271800000,
    high: 571.2809499888094,
    low: 571.2808568072832,
    close: 571.2808568072832,
    open: 571.2809499888094,
  },
  {
    timestamp: 1620272700000,
    high: 571.1742152842157,
    low: 571.1742152842157,
    close: 571.1742152842157,
    open: 571.1742152842157,
  },
  {
    timestamp: 1620273600000,
    high: 571.1716102454611,
    low: 571.0288842515337,
    close: 571.0288842515337,
    open: 571.0642228722581,
  },
  {
    timestamp: 1620275400000,
    high: 571.0203010949516,
    low: 571.0203010949516,
    close: 571.0203010949516,
    open: 571.0203010949516,
  },
  {
    timestamp: 1620277200000,
    high: 570.261632018576,
    low: 570.261632018576,
    close: 570.261632018576,
    open: 570.261632018576,
  },
  {
    timestamp: 1620279000000,
    high: 570.1348876529629,
    low: 570.1348876529629,
    close: 570.1348876529629,
    open: 570.1348876529629,
  },
  {
    timestamp: 1620279900000,
    high: 570.199730991694,
    low: 570.199730991694,
    close: 570.199730991694,
    open: 570.199730991694,
  },
  {
    timestamp: 1620282600000,
    high: 568.4408310147167,
    low: 568.4408310147167,
    close: 568.4408310147167,
    open: 568.4408310147167,
  },
  {
    timestamp: 1620284400000,
    high: 567.8217236373331,
    low: 567.5896453383704,
    close: 567.5896453383704,
    open: 567.8217236373331,
  },
  {
    timestamp: 1620288000000,
    high: 568.652510360092,
    low: 568.652510360092,
    close: 568.652510360092,
    open: 568.652510360092,
  },
  {
    timestamp: 1620288900000,
    high: 569.0169039594798,
    low: 569.0169039594798,
    close: 569.0169039594798,
    open: 569.0169039594798,
  },
  {
    timestamp: 1620289800000,
    high: 569.1372681718557,
    low: 569.1372681718557,
    close: 569.1372681718557,
    open: 569.1372681718557,
  },
  {
    timestamp: 1620293400000,
    high: 569.1425890413165,
    low: 569.1425890413165,
    close: 569.1425890413165,
    open: 569.1425890413165,
  },
  {
    timestamp: 1620294300000,
    high: 571.4603226652566,
    low: 569.668539984208,
    close: 571.3510882379371,
    open: 569.668539984208,
  },
  {
    timestamp: 1620295200000,
    high: 575.0297756308146,
    low: 565.6188600247405,
    close: 575.0297756308146,
    open: 571.2768914562338,
  },
  {
    timestamp: 1620296100000,
    high: 579.5414875855951,
    low: 578.0875180733055,
    close: 579.5414875855951,
    open: 578.0875180733055,
  },
  {
    timestamp: 1620297000000,
    high: 580.4591998073045,
    low: 580.4591998073045,
    close: 580.4591998073045,
    open: 580.4591998073045,
  },
  {
    timestamp: 1620299700000,
    high: 580.462401844569,
    low: 580.462401844569,
    close: 580.462401844569,
    open: 580.462401844569,
  },
  {
    timestamp: 1620303300000,
    high: 580.450191330308,
    low: 580.450191330308,
    close: 580.450191330308,
    open: 580.450191330308,
  },
  {
    timestamp: 1620305100000,
    high: 580.4060918534583,
    low: 580.4060918534583,
    close: 580.4060918534583,
    open: 580.4060918534583,
  },
  {
    timestamp: 1620306000000,
    high: 580.2988479516713,
    low: 580.2988479516713,
    close: 580.2988479516713,
    open: 580.2988479516713,
  },
  {
    timestamp: 1620306900000,
    high: 578.5227831917862,
    low: 578.5121109550881,
    close: 578.5121109550881,
    open: 578.5227831917862,
  },
  {
    timestamp: 1620307800000,
    high: 578.3521310367136,
    low: 578.224208690017,
    close: 578.224208690017,
    open: 578.3521310367136,
  },
  {
    timestamp: 1620308700000,
    high: 578.1781390176766,
    low: 578.1781390176766,
    close: 578.1781390176766,
    open: 578.1781390176766,
  },
  {
    timestamp: 1620309600000,
    high: 574.5402154361069,
    low: 574.2966785397088,
    close: 574.5402154361069,
    open: 574.2966785397088,
  },
  {
    timestamp: 1620310500000,
    high: 574.6374782052543,
    low: 574.3595582585991,
    close: 574.6374782052543,
    open: 574.3595582585991,
  },
  {
    timestamp: 1620311400000,
    high: 575.0993626799352,
    low: 575.0993626799352,
    close: 575.0993626799352,
    open: 575.0993626799352,
  },
  {
    timestamp: 1620313200000,
    high: 573.7701312728145,
    low: 573.7701312728145,
    close: 573.7701312728145,
    open: 573.7701312728145,
  },
  {
    timestamp: 1620314100000,
    high: 573.3906631152785,
    low: 573.3906631152785,
    close: 573.3906631152785,
    open: 573.3906631152785,
  },
  {
    timestamp: 1620315000000,
    high: 573.4334610811361,
    low: 573.4334610811361,
    close: 573.4334610811361,
    open: 573.4334610811361,
  },
  {
    timestamp: 1620315900000,
    high: 571.6595888644223,
    low: 571.6595888644223,
    close: 571.6595888644223,
    open: 571.6595888644223,
  },
  {
    timestamp: 1620316800000,
    high: 571.7534533028926,
    low: 571.7534533028926,
    close: 571.7534533028926,
    open: 571.7534533028926,
  },
  {
    timestamp: 1620317700000,
    high: 577.9623648979384,
    low: 574.8537177533384,
    close: 576.1674529591473,
    open: 574.8537177533384,
  },
  {
    timestamp: 1620318600000,
    high: 576.1563193117207,
    low: 576.0620257439493,
    close: 576.0620257439493,
    open: 576.1563193117207,
  },
  {
    timestamp: 1620319500000,
    high: 574.275952158709,
    low: 571.177013121888,
    close: 571.177013121888,
    open: 574.275952158709,
  },
  {
    timestamp: 1620321300000,
    high: 571.2079586608608,
    low: 571.2079586608608,
    close: 571.2079586608608,
    open: 571.2079586608608,
  },
  {
    timestamp: 1620323100000,
    high: 571.324057673865,
    low: 571.324057673865,
    close: 571.324057673865,
    open: 571.324057673865,
  },
  {
    timestamp: 1620324000000,
    high: 571.1253547573914,
    low: 570.0875973567182,
    close: 570.0875973567182,
    open: 571.1253547573914,
  },
  {
    timestamp: 1620324900000,
    high: 570.0805475832676,
    low: 570.0805475832676,
    close: 570.0805475832676,
    open: 570.0805475832676,
  },
  {
    timestamp: 1620325800000,
    high: 570.0257972684403,
    low: 559.1035539331212,
    close: 559.1035539331212,
    open: 570.0257972684403,
  },
  {
    timestamp: 1620328500000,
    high: 557.5649037694549,
    low: 556.0279702412793,
    close: 556.0279702412793,
    open: 557.5649037694549,
  },
  {
    timestamp: 1620329400000,
    high: 556.6968218685071,
    low: 556.6968218685071,
    close: 556.6968218685071,
    open: 556.6968218685071,
  },
  {
    timestamp: 1620330300000,
    high: 560.7228138291837,
    low: 558.2216468935494,
    close: 560.7228138291837,
    open: 558.2216468935494,
  },
  {
    timestamp: 1620332100000,
    high: 560.5876666979001,
    low: 560.5876666979001,
    close: 560.5876666979001,
    open: 560.5876666979001,
  },
  {
    timestamp: 1620333000000,
    high: 560.5186489036859,
    low: 559.9302964393763,
    close: 559.9302964393763,
    open: 560.5186489036859,
  },
  {
    timestamp: 1620335700000,
    high: 560.8859962694225,
    low: 560.8859962694225,
    close: 560.8859962694225,
    open: 560.8859962694225,
  },
  {
    timestamp: 1620337500000,
    high: 562.6549059693484,
    low: 561.1228262312293,
    close: 562.6549059693484,
    open: 561.1228262312293,
  },
  {
    timestamp: 1620338400000,
    high: 562.5749239504988,
    low: 562.5749239504988,
    close: 562.5749239504988,
    open: 562.5749239504988,
  },
  {
    timestamp: 1620340200000,
    high: 564.1086094674863,
    low: 564.1086094674863,
    close: 564.1086094674863,
    open: 564.1086094674863,
  },
  {
    timestamp: 1620341100000,
    high: 564.1156752788603,
    low: 564.1156752788603,
    close: 564.1156752788603,
    open: 564.1156752788603,
  },
  {
    timestamp: 1620342000000,
    high: 563.8686326269438,
    low: 563.8686326269438,
    close: 563.8686326269438,
    open: 563.8686326269438,
  },
  {
    timestamp: 1620343800000,
    high: 565.4032072056408,
    low: 565.4032072056408,
    close: 565.4032072056408,
    open: 565.4032072056408,
  },
  {
    timestamp: 1620344700000,
    high: 564.9161906724804,
    low: 564.846451581273,
    close: 564.846451581273,
    open: 564.9161906724804,
  },
  {
    timestamp: 1620345600000,
    high: 565.3129449522828,
    low: 563.3005556458523,
    close: 565.3129449522828,
    open: 563.3005556458523,
  },
  {
    timestamp: 1620346500000,
    high: 566.8491299730733,
    low: 566.7792504378252,
    close: 566.7792504378252,
    open: 566.8491299730733,
  },
  {
    timestamp: 1620347400000,
    high: 567.6311377719769,
    low: 566.8226586070456,
    close: 567.6311377719769,
    open: 566.8226586070456,
  },
  {
    timestamp: 1620349200000,
    high: 568.393145669603,
    low: 562.3084190409248,
    close: 562.3084190409248,
    open: 568.393145669603,
  },
  {
    timestamp: 1620350100000,
    high: 563.0673266288399,
    low: 563.0673266288399,
    close: 563.0673266288399,
    open: 563.0673266288399,
  },
  {
    timestamp: 1620351000000,
    high: 563.0460469915702,
    low: 563.0460469915702,
    close: 563.0460469915702,
    open: 563.0460469915702,
  },
  {
    timestamp: 1620351900000,
    high: 562.6940165863563,
    low: 562.6940165863563,
    close: 562.6940165863563,
    open: 562.6940165863563,
  },
  {
    timestamp: 1620352800000,
    high: 562.2290121119479,
    low: 562.2290121119479,
    close: 562.2290121119479,
    open: 562.2290121119479,
  },
  {
    timestamp: 1620354600000,
    high: 560.6865799646575,
    low: 559.1464640169283,
    close: 559.1464640169283,
    open: 560.6865799646575,
  },
  {
    timestamp: 1620356400000,
    high: 558.6737643409452,
    low: 558.5032601234623,
    close: 558.5032601234623,
    open: 558.6737643409452,
  },
  {
    timestamp: 1620358200000,
    high: 557.7252518300813,
    low: 557.7252518300813,
    close: 557.7252518300813,
    open: 557.7252518300813,
  },
  {
    timestamp: 1620359100000,
    high: 559.452591197762,
    low: 559.452591197762,
    close: 559.452591197762,
    open: 559.452591197762,
  },
  {
    timestamp: 1620360000000,
    high: 557.9238732313372,
    low: 551.1413593852167,
    close: 554.1625302396624,
    open: 557.9238732313372,
  },
  {
    timestamp: 1620360900000,
    high: 555.7240520136215,
    low: 555.674531175535,
    close: 555.7240520136215,
    open: 555.674531175535,
  },
  {
    timestamp: 1620361800000,
    high: 554.0781517227211,
    low: 554.0781517227211,
    close: 554.0781517227211,
    open: 554.0781517227211,
  },
  {
    timestamp: 1620362700000,
    high: 555.9093975255644,
    low: 554.0935763098537,
    close: 555.9093975255644,
    open: 554.0935763098537,
  },
  {
    timestamp: 1620363600000,
    high: 556.7596063111193,
    low: 556.0023730597429,
    close: 556.7596063111193,
    open: 556.0023730597429,
  },
  {
    timestamp: 1620365400000,
    high: 558.3270073972132,
    low: 556.8114287909416,
    close: 558.3270073972132,
    open: 556.8114287909416,
  },
  {
    timestamp: 1620367200000,
    high: 558.7824867555943,
    low: 558.7824867555943,
    close: 558.7824867555943,
    open: 558.7824867555943,
  },
  {
    timestamp: 1620369000000,
    high: 562.0179021454524,
    low: 560.3025781550792,
    close: 562.0179021454524,
    open: 560.3025781550792,
  },
  {
    timestamp: 1620369900000,
    high: 562.0080817771758,
    low: 562.0080817771758,
    close: 562.0080817771758,
    open: 562.0080817771758,
  },
  {
    timestamp: 1620373500000,
    high: 560.4783187009747,
    low: 560.4783187009747,
    close: 560.4783187009747,
    open: 560.4783187009747,
  },
  {
    timestamp: 1620374400000,
    high: 558.9505059072079,
    low: 558.9505059072079,
    close: 558.9505059072079,
    open: 558.9505059072079,
  },
  {
    timestamp: 1620375300000,
    high: 558.7316785819487,
    low: 558.7315744378288,
    close: 558.7315744378288,
    open: 558.7316785819487,
  },
  {
    timestamp: 1620376200000,
    high: 559.2700965276954,
    low: 558.7201382932576,
    close: 558.7201382932576,
    open: 559.2700965276954,
  },
  {
    timestamp: 1620377100000,
    high: 559.7884860040957,
    low: 558.2725955125745,
    close: 559.7884860040957,
    open: 558.3870242987017,
  },
  {
    timestamp: 1620378000000,
    high: 561.2454700974902,
    low: 559.7277145674427,
    close: 561.0931142383333,
    open: 559.7780560002528,
  },
  {
    timestamp: 1620379800000,
    high: 562.5589149792357,
    low: 561.0392143359311,
    close: 562.5589149792357,
    open: 561.0392143359311,
  },
  {
    timestamp: 1620381600000,
    high: 564.825992475405,
    low: 564.0806119374416,
    close: 564.825992475405,
    open: 564.0806119374416,
  },
  {
    timestamp: 1620382500000,
    high: 564.8106789982139,
    low: 564.8003967441988,
    close: 564.8003967441988,
    open: 564.8106789982139,
  },
  {
    timestamp: 1620383400000,
    high: 565.0122815398387,
    low: 565.0122815398387,
    close: 565.0122815398387,
    open: 565.0122815398387,
  },
  {
    timestamp: 1620384300000,
    high: 565.0122384439766,
    low: 565.0122384439766,
    close: 565.0122384439766,
    open: 565.0122384439766,
  },
  {
    timestamp: 1620385200000,
    high: 564.9947583554654,
    low: 564.9947583554654,
    close: 564.9947583554654,
    open: 564.9947583554654,
  },
  {
    timestamp: 1620386100000,
    high: 564.7315180958523,
    low: 564.726251367374,
    close: 564.726251367374,
    open: 564.7315180958523,
  },
  {
    timestamp: 1620387000000,
    high: 566.1025337740446,
    low: 564.5781421341958,
    close: 566.1025337740446,
    open: 564.5781421341958,
  },
]