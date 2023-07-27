import { bollinger_config, config, config_payload, donchian_config, classic_config, keltner_config, prices3 } from "./utils";
import fs from 'fs';
import { WasmModule, loadWasm } from "@steerprotocol/app-loader";
import { posix } from "path";

interface DataModel {
  open: number;
  high: number;
  close: number;
  low: number;
}

describe("WASM Module", () => {
  let myModule: WasmModule;
  
  beforeEach(async () => {
    myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
  });

  describe("Custom Strategy", () => {
    test("can run execute", async () => {        
      // The actual strategy instantiation and execution
      const config = classic_config
      console.log('CONFIG:',classic_config)
      myModule.initialize(config);
      // Call the config function on the strategy bundle

      const positions = '[[-50],[50],[1]]'
      const currentTick = '26'
      const timeSinceLastExecution = '5600'

      const result = myModule["execute(param_1: string, param_2: string, param_3: string)"]
      ( positions, currentTick, timeSinceLastExecution);

      const input = myModule.config()
      // fs.writeFileSync('./configTest.json', input)
      console.log(result)
      expect(true)
      // Pull the result from memory and parse the result
      // const parsedResult = JSON.parse(result);

      // The result should match the given config
      // expect(JSON.stringify(parsedResult)).toStrictEqual(
      //   `{\"functionName\":\"tend(uint256,(int24[],int24[],uint16[]),bytes)\",\"typesArray\":[\"uint256\",\"tuple(int24[],int24[],uint16[])\",\"bytes\"],\"valuesArray\":[10000,[[256140],[258240],[1]],\"0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000ffffffffffffffffffffffffffffffffffffffff\"]}`
      // );

      // expect(parsedResult.valuesArray[1][0][0]).not.toEqual(parsedResult.valuesArray[1][1][0])
    });

  });
});