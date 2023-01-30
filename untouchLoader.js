const fs = require("fs");
const AsBind = require("as-bind/dist/as-bind.cjs.js");

const imports = {
  env: {
    abort: (msg, file, line, column) => {
      console.error(
        'abort called at ' + file + ' line:' + line + ':' + column,
        'msg: ' + msg,
      )
    },
  },
  console: {
    log: message => {
      console.log(asBindInstance.exports.__getString(message));
    }
  }
};

const asBindInstance = AsBind.instantiateSync(fs.readFileSync(__dirname + "/build/untouched.wasm"), imports)

module.exports = asBindInstance.exports;

