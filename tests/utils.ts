export const config_payload = `{        
  "lookback": 72,
  "multiplier": 1.1,
  "poolFee": 3000,
  "liquidityShape": "Linear"
}`;

export const classic_config = `{
  "elapsedTendTime": 604800,
  "triggerStyle": "Price moves percentage of active range away",
  "percentageOfPositionRangeToTrigger": 2
  "strategy": "Classic",
  "liquidityShape": "Linear",
  "poolFee": 3000,
  "placementType": "Position over current price",
  "triggerWhenOver": true,
  "positionSize": 600
}`
//Position under current price
//Position centered around current price

// trigger type
// linear positions working
//Price moves one way past positions - works
// Price set distance - works
// Price leaves active range - works
// Price moves percentage of active range away - works

export const bollinger_config = `{
  "elapsedTendTime": 604800,
  "triggerStyle": "Price moves one way past positions",
  "triggerWhenOver": false,
  "strategy": "Bollinger Band",
  "liquidityShape": "Linear",
  "lookback": 5,
  "standardDeviations": 6,
  "poolFee": 3000,
}`

export const keltner_config = `{
  "elapsedTendTime": 604800,
  "triggerStyle": "None",
  "strategy": "Keltner Channel",
  "liquidityShape": "Linear",
  "lookback": 12,
  "atrLength": 12,
  "multiplier": 5,
  "poolFee": 500,
}`

export const donchian_config = `{
  "elapsedTendTime": 604800,
  "triggerStyle": "None",
  "strategy": "Donchian Channel",
  "liquidityShape": "Linear",
  "lookback": 12,
  "multiplier": 1.7,
  "poolFee": 3000,
}`

export const config = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Strategy Config",
  "type": "object",
  "expectedDataTypes": ["OHLC"],
  "properties": {
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
    "liquidityShape": {
      "enum": ["Linear","ExponentialDecay","Logarithmic","Sine","ExponentialGrowth","LogarithmicDecay"],
      "title": "Liquidity Shape",
      "type": "string",
      "default": "Linear"
    }
  },
  "allOf": [
    {
    "if": {
      "properties": {
        "liquidityShape": {
          "const": "Linear"
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
        "liquidityShape": {
          "const": "Normalized"
        }
      }
    },
    "then": {
      "properties": {
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "mean": {
          "type": "number",
          "title": "Mean"
        },
        "stdDev": {
          "type": "number",
          "title": "Standard Deviation"
        }
      },
      "required": [
        "binSizeMultiplier",
        "mean",
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
          "description": "Rate of decay",
          "detailedDescription": "The higher the rate, the faster the decay."
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "k": {
          "type": "number",
          "title": "K"
        }
      },
      "required": [
        "binSizeMultiplier",
        "k"
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "base": {
          "type": "number",
          "title": "Base"
        }
      },
      "required": [
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "exponent": {
          "type": "number",
          "title": "Exponent"
        }
      },
      "required": [
        "binSizeMultiplier",
        "exponent"
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "threshold": {
          "type": "number",
          "title": "Threshold"
        }
      },
      "required": [
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "amplitude": {
          "type": "number",
          "title": "Amplitude"
        },
        "frequency": {
          "type": "number",
          "title": "Frequency"
        },
        "phase": {
          "type": "number",
          "title": "Phase"
        }
      },
      "required": [
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
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
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "a": {
          "type": "number",
          "title": "A"
        },
        "b": {
          "type": "number",
          "title": "B"
        },
        "c": {
          "type": "number",
          "title": "C"
        }
      },
      "required": [
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "a": {
          "type": "number",
          "title": "A"
        },
        "b": {
          "type": "number",
          "title": "B"
        },
        "c": {
          "type": "number",
          "title": "C"
        },
        "d": {
          "type": "number",
          "title": "D"
        }
      },
      "required": [
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
        },
        "rate": {
          "type": "number",
          "title": "Rate"
        }
      },
      "required": [
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
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
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
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
        "binSizeMultiplier",
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
        "binSizeMultiplier": {
          "type": "number",
          "title": "Position Scale"
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
        "binSizeMultiplier",
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
  ],
  "required": [
    "lookback",
    "poolFee",
    "multiplier"
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