import { candles2, config, donchian_config, prices3 } from "./utils";
import fs from 'fs';
import { WasmModule, loadWasm } from "@steerprotocol/app-loader";

describe("WASM Module", () => {
  let myModule: WasmModule;
  
  beforeEach(async () => {
    myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
  });

  describe("Custom Strategy", () => {
    test("can render config", async () => {
      // Call the config function on the strategy bundle
      const result = myModule.config();
    //   fs.writeFileSync('./stcnf.txt', result)
      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      // The result should match the given config
      expect(parsedResult).toStrictEqual(JSON.parse(config));
    });

    test("can run execute", async () => {        
      // The actual strategy instantiation and execution
      myModule.initialize(donchian_config);
      // Here we pin the array to the WASM memory
      // let priceMemoryRef = myModule.__pin(
      //   myModule.__newString(JSON.stringify(prices))
      // );

      // Call the config function on the strategy bundle
      const result = myModule.execute(JSON.stringify([...candles2]));
        console.log(result)
      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      // The result should match the given config
      expect(JSON.stringify(parsedResult)).toStrictEqual(
        `{\"functionName\":\"tend(uint256,(int24[],int24[],uint16[]),bytes)\",\"typesArray\":[\"uint256\",\"tuple(int24[],int24[],uint16[])\",\"bytes\"],\"valuesArray\":[10000,[[104220,107820,111420],[107820,111420,115020],[848,544,241]],\"0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000ffffffffffffffffffffffffffffffffffffffff\"]}`
      );

      expect(parsedResult.valuesArray[1][0][0]).not.toEqual(parsedResult.valuesArray[1][1][0])
    });

    test("bins width is greater than 0", async () => {        

      // The actual strategy instantiation and execution
      myModule.initialize(donchian_config);
      // Here we pin the array to the WASM memory
      // let priceMemoryRef = myModule.__pin(
      //   myModule.__newString(JSON.stringify(prices))
      // );

      // Call the config function on the strategy bundle
      const result = myModule.execute(JSON.stringify([...candles2]));
      
      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      expect(parsedResult.valuesArray[1][0][0]).not.toEqual(parsedResult.valuesArray[1][1][0])
    });
  });
});