export const config_payload = `{"lookback":5,"binWidth":120,"poolFee":3000,"multiplier":1.0}`;

export const config = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Strategy Config",
  "type": "object",
  "properties": {
    "lookback": {
        "type": "number",
        "description": "Lookback period for channel",
        "default": 5
    },
    "multiplier": {
        "type": "number",
        "description": "Multiplier for channel width",
        "default": 1.0
    },
    "poolFee": {
      "description": "Pool fee percent for desired Uniswapv3 pool",
      "enum" : [10000, 3000, 500, 100],
      "enumNames": ["1%", "0.3%", "0.05%", "0.01%"]
    },
    "binWidth": {
        "type": "number",
        "description": "Width for liquidity position, must be a multiple of pool tick spacing",
        "default": 600
    }
  },
  "required": ["period", "binWidth", "poolFee", "multiplier"]
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