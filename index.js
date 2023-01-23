const fs = require("fs");
import * as AsBind from "as-bind/dist/as-bind.cjs.js";

const imports = {
  env: {
    abort(msg, file, line, column) {
      console.error(
        'abort called at ' + file + ' line:' + line + ':' + column,
        'msg: ' + msg,
      )
    },
  },
  console: {
    log: (msg) => {
      console.log(msg)
    },
  },
};

const asBindInstance = AsBind.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports)

module.exports = asBindInstance.exports;
