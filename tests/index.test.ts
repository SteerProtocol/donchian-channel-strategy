import { config, config_payload, dope } from "./utils";
import fs from "fs";
import { WasmModule, loadWasm } from "@steerprotocol/app-loader";

interface DataModel {
  open: number;
  high: number;
  close: number;
  low: number;
}
const prices3 = [
  {
    timestamp: 1688349600000,
    high: 157693904255.06702,
    low: 157607825538.09076,
    open: 157668198050.51352,
    close: 157693904255.06702,
    volume: 30.16066647574785,
  },
  {
    timestamp: 1688351400000,
    high: 157729263206.12164,
    low: 157687857243.91013,
    open: 157729065070.46802,
    close: 157694202514.995,
    volume: 13.356221608273076,
  },
  {
    timestamp: 1688353200000,
    high: 157937927473.2684,
    low: 157695160083.76352,
    open: 157695160083.76352,
    close: 157870174196.42307,
    volume: 49.36688663108066,
  },
  {
    timestamp: 1688355000000,
    high: 157870239042.2842,
    low: 157855642029.81238,
    open: 157870239042.2842,
    close: 157855714316.05292,
    volume: 2.643736352767434,
  },
  {
    timestamp: 1688356800000,
    high: 157898623607.30988,
    low: 157826207112.88828,
    open: 157855714321.14,
    close: 157827686898.8729,
    volume: 31.135222535369397,
  },
  {
    timestamp: 1688358600000,
    high: 157829821957.48663,
    low: 157547989422.3526,
    open: 157828077468.98035,
    close: 157547989422.3526,
    volume: 44.30528180778599,
  },
  {
    timestamp: 1688360400000,
    high: 157602485814.0803,
    low: 157547992092.2514,
    open: 157547992092.2514,
    close: 157602485814.0803,
    volume: 8.084102397719155,
  },
  {
    timestamp: 1688362200000,
    high: 157602455049.38467,
    low: 157602360743.43207,
    open: 157602443170.43628,
    close: 157602360743.43207,
    volume: 0.03374975840758341,
  },
  {
    timestamp: 1688364000000,
    high: 157645243032.0099,
    low: 157592846473.8792,
    open: 157613922906.2875,
    close: 157644975532.84088,
    volume: 13.178322127637502,
  },
  {
    timestamp: 1688365800000,
    high: 157646403646.4377,
    low: 157481812612.26352,
    open: 157644728434.54355,
    close: 157482227357.53604,
    volume: 25.48050857475488,
  },
  {
    timestamp: 1688367600000,
    high: 157461856793.2921,
    low: 156880116560.85147,
    open: 157461856793.2921,
    close: 156880116560.85147,
    volume: 85.18350290723461,
  },
  {
    timestamp: 1688369400000,
    high: 156882096171.35736,
    low: 156066003088.15723,
    open: 156881058105.23532,
    close: 156136544240.58395,
    volume: 185.0021748866885,
  },
  {
    timestamp: 1688371200000,
    high: 156136544246.28104,
    low: 155734398389.11542,
    open: 156136544246.28104,
    close: 156058733075.07782,
    volume: 151.99720993850244,
  },
  {
    timestamp: 1688373000000,
    high: 156275372420.67172,
    low: 156055085093.89368,
    open: 156058804287.29785,
    close: 156275316975.84866,
    volume: 30.363403286931057,
  },
  {
    timestamp: 1688374800000,
    high: 156410535381.72797,
    low: 156275458453.7745,
    open: 156275458453.7745,
    close: 156347614175.08118,
    volume: 27.438409411413133,
  },
  {
    timestamp: 1688376600000,
    high: 156446690914.3045,
    low: 156383165190.69135,
    open: 156383165190.69135,
    close: 156446690914.3045,
    volume: 14.776297579561504,
  },
  {
    timestamp: 1688378400000,
    high: 156459146860.97607,
    low: 156368665818.5308,
    open: 156446734098.2278,
    close: 156368708950.30673,
    volume: 14.966305442244877,
  },
  {
    timestamp: 1688380200000,
    high: 156368746480.81808,
    low: 156349076952.21536,
    open: 156368746480.81808,
    close: 156349076952.21536,
    volume: 2.900584211111534,
  },
  {
    timestamp: 1688382000000,
    high: 156348179109.85886,
    low: 156165632805.66138,
    open: 156348179109.85886,
    close: 156165632805.66138,
    volume: 37.59609783918685,
  },
  {
    timestamp: 1688383800000,
    high: 156250791785.40894,
    low: 156164904111.69388,
    open: 156164904111.69388,
    close: 156229548149.60864,
    volume: 16.324685933318964,
  },
  {
    timestamp: 1688385600000,
    high: 156350304414.663,
    low: 156226878566.05478,
    open: 156229548154.75504,
    close: 156251452067.6925,
    volume: 35.14971224488241,
  },
  {
    timestamp: 1688387400000,
    high: 156251112929.36975,
    low: 156075678721.056,
    open: 156251112929.36975,
    close: 156075678721.056,
    volume: 26.359637884409793,
  },
  {
    timestamp: 1688389200000,
    high: 156073689231.47247,
    low: 156007167765.60898,
    open: 156073689231.47247,
    close: 156020659991.8389,
    volume: 11.33166723492534,
  },
  {
    timestamp: 1688391000000,
    high: 156039552032.77176,
    low: 155887999245.19476,
    open: 156021402409.88812,
    close: 156039552032.77176,
    volume: 40.51502880377242,
  },
  {
    timestamp: 1688392800000,
    high: 156486970347.6012,
    low: 155980415045.0871,
    open: 156049298636.31418,
    close: 156486970347.6012,
    volume: 101.87399347423512,
  },
  {
    timestamp: 1688394600000,
    high: 156766820883.64264,
    low: 156396224002.2785,
    open: 156493878100.83282,
    close: 156766690135.21802,
    volume: 70.40011195439207,
  },
  {
    timestamp: 1688396400000,
    high: 157177654394.2478,
    low: 156871124714.45746,
    open: 156871124714.45746,
    close: 157177654394.2478,
    volume: 124.37483863385329,
  },
  {
    timestamp: 1688398200000,
    high: 157854570909.66867,
    low: 157211061666.86942,
    open: 157211061666.86942,
    close: 157770544704.33832,
    volume: 241.40231267766632,
  },
  {
    timestamp: 1688400000000,
    high: 157961706165.75836,
    low: 157800733097.69437,
    open: 157806998922.38034,
    close: 157961706165.75836,
    volume: 78.83474443559078,
  },
  {
    timestamp: 1688401800000,
    high: 158102047998.43182,
    low: 157951952083.7201,
    open: 157955593258.0731,
    close: 157986700089.94016,
    volume: 56.672655344947984,
  },
  {
    timestamp: 1688403600000,
    high: 158035843975.98215,
    low: 157754434219.39972,
    open: 157999084271.93216,
    close: 157755199795.54,
    volume: 51.13796749412629,
  },
  {
    timestamp: 1688405400000,
    high: 157917949402.22934,
    low: 157664180546.7062,
    open: 157668713448.64822,
    close: 157852874136.18912,
    volume: 65.99462836770003,
  },
  {
    timestamp: 1688407200000,
    high: 158175478920.73016,
    low: 157852833324.69785,
    open: 157852833324.69785,
    close: 158175235017.2988,
    volume: 51.432558104689285,
  },
  {
    timestamp: 1688409000000,
    high: 158497952519.19656,
    low: 158160021876.0296,
    open: 158160461870.32574,
    close: 158342461320.60843,
    volume: 98.50616667537307,
  },
  {
    timestamp: 1688410800000,
    high: 158788759872.2498,
    low: 158274645165.65128,
    open: 158274645165.65128,
    close: 158788157614.41318,
    volume: 93.48785275822793,
  },
  {
    timestamp: 1688412600000,
    high: 159081635993.9955,
    low: 158715807461.78085,
    open: 158793925633.2627,
    close: 158944072290.58377,
    volume: 124.12865916117555,
  },
  {
    timestamp: 1688414400000,
    high: 159158047201.09244,
    low: 158805938463.08685,
    open: 158944236904.2077,
    close: 159147443686.61646,
    volume: 76.19316972669886,
  },
  {
    timestamp: 1688416200000,
    high: 159129594630.83337,
    low: 158967006829.79126,
    open: 159129594630.83337,
    close: 158967006829.79126,
    volume: 63.32166824788743,
  },
  {
    timestamp: 1688418000000,
    high: 158937518145.53827,
    low: 158614466184.68488,
    open: 158937518145.53827,
    close: 158720269074.48578,
    volume: 121.92539696019679,
  },
  {
    timestamp: 1688419800000,
    high: 158750013352.0856,
    low: 158674643701.26093,
    open: 158720587300.30432,
    close: 158674672310.34937,
    volume: 16.54754802635327,
  },
  {
    timestamp: 1688421600000,
    high: 158946582498.1833,
    low: 158707113382.72058,
    open: 158707113382.72058,
    close: 158946551040.4459,
    volume: 41.66995893551108,
  },
  {
    timestamp: 1688423400000,
    high: 159145910028.98886,
    low: 158851797825.14474,
    open: 158911431746.91635,
    close: 159145910028.98886,
    volume: 61.88834945720135,
  },
  {
    timestamp: 1688425200000,
    high: 159270038288.89795,
    low: 159164233658.20416,
    open: 159164233658.20416,
    close: 159270038288.89795,
    volume: 29.71603828636108,
  },
  {
    timestamp: 1688427000000,
    high: 159282343636.41852,
    low: 159269613745.82452,
    open: 159269965353.77988,
    close: 159282343636.41852,
    volume: 7.504850914502931,
  },
  {
    timestamp: 1688428800000,
    high: 159317341120.434,
    low: 159284080570.4181,
    open: 159284080570.4181,
    close: 159317341120.434,
    volume: 20.103625785039146,
  },
  {
    timestamp: 1688430600000,
    high: 159367476907.58932,
    low: 159140411935.5354,
    open: 159306663685.1282,
    close: 159367475084.41013,
    volume: 144.79004066604296,
  },
  {
    timestamp: 1688432400000,
    high: 159436683456.56564,
    low: 159266293546.09802,
    open: 159367457473.4275,
    close: 159436683456.56564,
    volume: 198.7620057369917,
  },
  {
    timestamp: 1688434200000,
    high: 160039895253.724,
    low: 159436598934.5943,
    open: 159436598934.5943,
    close: 160039895253.724,
    volume: 140.45751643993418,
  },
  {
    timestamp: 1688436000000,
    high: 160086626255.96707,
    low: 159966717488.2496,
    open: 160051476444.46075,
    close: 159969622176.74,
    volume: 25.055280059523977,
  },
  {
    timestamp: 1688437800000,
    high: 159926551379.51584,
    low: 159648919618.24707,
    open: 159926551379.51584,
    close: 159717023174.73294,
    volume: 62.21970429050754,
  },
  {
    timestamp: 1688439600000,
    high: 159740075993.30234,
    low: 159279111715.12888,
    open: 159717634573.88174,
    close: 159279111715.12888,
    volume: 194.44174790705003,
  },
  {
    timestamp: 1688441400000,
    high: 159270234222.09705,
    low: 158994569501.42294,
    open: 159270234222.09705,
    close: 158994569501.42294,
    volume: 68.02324848762731,
  },
  {
    timestamp: 1688443200000,
    high: 159046632692.20673,
    low: 158994569506.3268,
    open: 158994569506.3268,
    close: 159045081422.6177,
    volume: 8.693583537531891,
  },
  {
    timestamp: 1688445000000,
    high: 159106890919.8783,
    low: 158983016078.01828,
    open: 159044783292.05115,
    close: 158983016078.01828,
    volume: 49.13300157417077,
  },
  {
    timestamp: 1688446800000,
    high: 159004576538.39758,
    low: 158992462169.12567,
    open: 158992462169.12567,
    close: 159004576538.39758,
    volume: 3.5054311215511142,
  },
  {
    timestamp: 1688448600000,
    high: 159005041126.17096,
    low: 158862716455.13965,
    open: 159005041126.17096,
    close: 158862716455.13965,
    volume: 23.263286303851338,
  },
  {
    timestamp: 1688450400000,
    high: 158830803553.18112,
    low: 158704625091.9618,
    open: 158830803553.18112,
    close: 158704686542.67212,
    volume: 34.028211144599815,
  },
  {
    timestamp: 1688452200000,
    high: 158736205070.24078,
    low: 158705014514.48917,
    open: 158705014514.48917,
    close: 158736205070.24078,
    volume: 4.815306134564317,
  },
  {
    timestamp: 1688454000000,
    high: 158750885620.9655,
    low: 158736244977.77853,
    open: 158736244977.77853,
    close: 158750885620.9655,
    volume: 2.4236628933755617,
  },
  {
    timestamp: 1688455800000,
    high: 158751122281.84625,
    low: 158728529725.799,
    open: 158751122281.84625,
    close: 158730035290.53497,
    volume: 3.767132196048829,
  },
  {
    timestamp: 1688457600000,
    high: 158728529730.60843,
    low: 158728529730.60843,
    open: 158728529730.60843,
    close: 158728529730.60843,
    volume: 7.94039668477e-7,
  },
  {
    timestamp: 1688459400000,
    high: 158764203257.18286,
    low: 158665124240.75302,
    open: 158733183075.2178,
    close: 158665124240.75302,
    volume: 22.240020073611507,
  },
  {
    timestamp: 1688461200000,
    high: 158845919606.93863,
    low: 158666482751.95453,
    open: 158666482751.95453,
    close: 158795285010.23752,
    volume: 38.0290722594479,
  },
  {
    timestamp: 1688463000000,
    high: 158782144267.14902,
    low: 158694250715.17325,
    open: 158782144267.14902,
    close: 158700495406.2276,
    volume: 17.666657930236205,
  },
  {
    timestamp: 1688464800000,
    high: 158700602921.30563,
    low: 158669653483.95178,
    open: 158700602921.30563,
    close: 158669653483.95178,
    volume: 5.125721285171066,
  },
  {
    timestamp: 1688466600000,
    high: 158663408079.6284,
    low: 158539628838.26517,
    open: 158663408079.6284,
    close: 158581254655.6442,
    volume: 32.837362865864755,
  },
  {
    timestamp: 1688468400000,
    high: 158578699267.58047,
    low: 158439197801.58075,
    open: 158578699267.58047,
    close: 158470276028.41788,
    volume: 29.28113338838343,
  },
  {
    timestamp: 1688470200000,
    high: 158499925073.65,
    low: 158468942276.22977,
    open: 158494836238.3966,
    close: 158468942276.22977,
    volume: 9.979150874750543,
  },
  {
    timestamp: 1688472000000,
    high: 158615003558.4275,
    low: 158460966222.64276,
    open: 158468942281.03366,
    close: 158615003558.4275,
    volume: 31.064518731837957,
  },
  {
    timestamp: 1688473800000,
    high: 158726798748.8697,
    low: 158614924482.08868,
    open: 158614924482.08868,
    close: 158695303154.5438,
    volume: 23.020754252979543,
  },
  {
    timestamp: 1688475600000,
    high: 158694657619.27884,
    low: 158628851534.03552,
    open: 158694657619.27884,
    close: 158628874875.61047,
    volume: 14.648754328706502,
  },
  {
    timestamp: 1688477400000,
    high: 158638989848.4204,
    low: 158622389339.93976,
    open: 158622389339.93976,
    close: 158638989848.4204,
    volume: 3.540118013363775,
  },
  {
    timestamp: 1688479200000,
    high: 158699315842.25122,
    low: 158539856336.85007,
    open: 158588868598.47806,
    close: 158584650531.32883,
    volume: 91.85847399878662,
  },
  {
    timestamp: 1688481000000,
    high: 158584171074.1163,
    low: 158459240858.18628,
    open: 158583514417.2131,
    close: 158459642178.66382,
    volume: 24.432580756650964,
  },
  {
    timestamp: 1688482800000,
    high: 158448512888.97867,
    low: 158430252575.46915,
    open: 158430252575.46915,
    close: 158448512888.97867,
    volume: 7.60939694566949,
  },
  {
    timestamp: 1688484600000,
    high: 158528443827.70615,
    low: 158438516268.06326,
    open: 158448213009.97882,
    close: 158528404346.34756,
    volume: 21.385138507205003,
  },
  {
    timestamp: 1688486400000,
    high: 158528438590.59616,
    low: 158500228355.2615,
    open: 158528438590.59616,
    close: 158500228355.2615,
    volume: 4.534595857446528,
  },
  {
    timestamp: 1688488200000,
    high: 158500054191.23785,
    low: 158244409995.48077,
    open: 158500054191.23785,
    close: 158297411116.19705,
    volume: 53.138927969303126,
  },
  {
    timestamp: 1688490000000,
    high: 158482826058.44403,
    low: 158297390535.60117,
    open: 158297390535.60117,
    close: 158438524836.65222,
    volume: 85.41579365509126,
  },
  {
    timestamp: 1688491800000,
    high: 158464626793.04913,
    low: 158438293168.906,
    open: 158438293168.906,
    close: 158438424186.34607,
    volume: 8.30621008733618,
  },
  {
    timestamp: 1688493600000,
    high: 158482111893.1643,
    low: 158443369692.4835,
    open: 158443369692.4835,
    close: 158463026877.6132,
    volume: 10.552404545805137,
  },
  {
    timestamp: 1688495400000,
    high: 158512337125.31146,
    low: 158473062740.04318,
    open: 158473228114.77808,
    close: 158502716105.5278,
    volume: 9.521239784251236,
  },
  {
    timestamp: 1688497200000,
    high: 158537973197.88364,
    low: 158466402672.22256,
    open: 158528250102.07455,
    close: 158466474438.58527,
    volume: 17.186894752833066,
  },
  {
    timestamp: 1688499000000,
    high: 158854913819.50964,
    low: 158441379049.68478,
    open: 158466362776.77615,
    close: 158773917408.88818,
    volume: 94.04035964298433,
  },
  {
    timestamp: 1688500800000,
    high: 158773917414.04593,
    low: 158702753776.01566,
    open: 158773917414.04593,
    close: 158702753776.01566,
    volume: 11.18596446888828,
  },
  {
    timestamp: 1688502600000,
    high: 158702237177.79257,
    low: 158603406311.83102,
    open: 158702237177.79257,
    close: 158605106858.75323,
    volume: 15.896712456184273,
  },
  {
    timestamp: 1688504400000,
    high: 158693530656.4428,
    low: 158629406242.09427,
    open: 158629406242.09427,
    close: 158693530656.4428,
    volume: 23.14570429028359,
  },
  {
    timestamp: 1688506200000,
    high: 158686387025.9467,
    low: 158647102726.3343,
    open: 158686387025.9467,
    close: 158647102726.3343,
    volume: 7.731850969931424,
  },
  {
    timestamp: 1688508000000,
    high: 158647717688.13904,
    low: 158647717688.13904,
    open: 158647717688.13904,
    close: 158647717688.13904,
    volume: 0.1026,
  },
  {
    timestamp: 1688509800000,
    high: 158684593733.30185,
    low: 158647810456.9685,
    open: 158647810456.9685,
    close: 158684593733.30185,
    volume: 6.851878461693805,
  },
  {
    timestamp: 1688511600000,
    high: 158826619431.7771,
    low: 158733570144.4173,
    open: 158733570144.4173,
    close: 158826619431.7771,
    volume: 23.485200908871878,
  },
  {
    timestamp: 1688513400000,
    high: 158875738490.4327,
    low: 158826472180.2451,
    open: 158826472180.2451,
    close: 158875738490.4327,
    volume: 7.994044582318912,
  },
  {
    timestamp: 1688515200000,
    high: 158845977507.1835,
    low: 158844692651.01273,
    open: 158845977507.1835,
    close: 158844692651.01273,
    volume: 5.020593381360167,
  },
  {
    timestamp: 1688517000000,
    high: 158844821655.30713,
    low: 158844702136.00793,
    open: 158844702136.00793,
    close: 158844818069.91122,
    volume: 0.02152737993611462,
  },
  {
    timestamp: 1688518800000,
    high: 158967831340.3023,
    low: 158876634304.9003,
    open: 158878687938.60782,
    close: 158890776093.33182,
    volume: 31.61488218148632,
  },
  {
    timestamp: 1688520600000,
    high: 158890016387.90836,
    low: 158879178344.29218,
    open: 158890016387.90836,
    close: 158879178344.29218,
    volume: 1.774774125675255,
  },
];
describe("WASM Module", () => {
  let myModule: WasmModule;

  beforeEach(async () => {
    myModule = await loadWasm(
      fs.readFileSync(__dirname + "/../build/debug.wasm"),
      {}
    );
  });

  describe("Custom Strategy", () => {
    test("can render config", async () => {
      // Call the config function on the strategy bundle
      const result = myModule.config();
      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      // The result should match the given config
      expect(parsedResult).not.toBeNull();
    });

    test("can run execute", async () => {
      // The actual strategy instantiation and execution
      myModule.initialize(JSON.stringify({
        lookback: 4,
        multiplier: 1,
        liquidityShape: "Absolute",
        bins: 1,
        poolFee: 500,
      }));
      // Here we pin the array to the WASM memory
      // let priceMemoryRef = myModule.__pin(
      //   myModule.__newString(JSON.stringify(prices))
      // );

      // Call the config function on the strategy bundle
      const result = myModule.execute(JSON.stringify([...prices3]));

      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      // The result should match the given config
      expect(JSON.stringify(parsedResult)).toStrictEqual(
        `{\"functionName\":\"tend(uint256,(int24[],int24[],uint16[]),bytes)\",\"typesArray\":[\"uint256\",\"tuple(int24[],int24[],uint16[])\",\"bytes\"],\"valuesArray\":[10000,[[257920],[257940],[1]],\"0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000ffffffffffffffffffffffffffffffffffffffff\"]}`
      );

      expect(parsedResult.valuesArray[1][0][0]).not.toEqual(
        parsedResult.valuesArray[1][1][0]
      );
    });

    test("can run execute absolute", async () => {
      // The actual strategy instantiation and execution
      myModule.initialize(
        JSON.stringify({
          lookback: 4,
          multiplier: 1,
          liquidityShape: "Absolute",
          bins: 1,
          poolFee: 500,
        })
      );
      // Here we pin the array to the WASM memory
      // let priceMemoryRef = myModule.__pin(
      //   myModule.__newString(JSON.stringify(prices))
      // );

      // Call the config function on the strategy bundle
      const result = myModule.execute(JSON.stringify([...prices3]));

      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      // The result should match the given config
      expect(JSON.stringify(parsedResult)).toStrictEqual(
        `{\"functionName\":\"tend(uint256,(int24[],int24[],uint16[]),bytes)\",\"typesArray\":[\"uint256\",\"tuple(int24[],int24[],uint16[])\",\"bytes\"],\"valuesArray\":[10000,[[257920],[257940],[1]],\"0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000ffffffffffffffffffffffffffffffffffffffff\"]}`
      );

      expect(parsedResult.valuesArray[1][0][0]).not.toEqual(
        parsedResult.valuesArray[1][1][0]
      );
    });

    test("can run execute linear", async () => {
      // The actual strategy instantiation and execution
      myModule.initialize(
        JSON.stringify({
          lookback: 24,
          multiplier: 1.01,
          liquidityShape: "Linear",
          bins: 9,
          poolFee: 500,
        })
      );
      // Here we pin the array to the WASM memory
      // let priceMemoryRef = myModule.__pin(
      //   myModule.__newString(JSON.stringify(prices))
      // );

      // Call the config function on the strategy bundle
      const result = myModule.execute(JSON.stringify([...dope]));

      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      // The result should match the given config
      expect(JSON.stringify(parsedResult)).toStrictEqual(
        `{\"functionName\":\"tend(uint256,(int24[],int24[],uint16[]),bytes)\",\"typesArray\":[\"uint256\",\"tuple(int24[],int24[],uint16[])\",\"bytes\"],\"valuesArray\":[10000,[[1240,1263,1286,1309,1332,1355,1378,1401,1424,1447],[1263,1286,1309,1332,1355,1378,1401,1424,1447,1470],[952,854,755,657,558,459,361,262,164,65]],\"0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000ffffffffffffffffffffffffffffffffffffffff\"]}`
      );

      expect(parsedResult.valuesArray[1][0][0]).not.toEqual(
        parsedResult.valuesArray[1][1][0]
      );
    });
    
    test("can run execute normalized", async () => {
      // The actual strategy instantiation and execution
      myModule.initialize(
        JSON.stringify({
          lookback: 24,
          multiplier: 1.01,
          liquidityShape: "Normalized",
          bins: 5,
          poolFee: 500,
          stdDev: 3,
        })
      );
      // Here we pin the array to the WASM memory
      // let priceMemoryRef = myModule.__pin(
      //   myModule.__newString(JSON.stringify(prices))
      // );

      // Call the config function on the strategy bundle
      const result = myModule.execute(JSON.stringify([...dope]));

      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      // The result should match the given config
      expect(JSON.stringify(parsedResult)).toStrictEqual(
        `{\"functionName\":\"tend(uint256,(int24[],int24[],uint16[]),bytes)\",\"typesArray\":[\"uint256\",\"tuple(int24[],int24[],uint16[])\",\"bytes\"],\"valuesArray\":[10000,[[1240,1282,1324,1366,1408],[1282,1324,1366,1408,1450],[6,11,13,11,6]],\"0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000ffffffffffffffffffffffffffffffffffffffff\"]}`
      );

      expect(parsedResult.valuesArray[1][0][0]).not.toEqual(
        parsedResult.valuesArray[1][1][0]
      );
    });
    
    test("can run execute triangle", async () => {
      // The actual strategy instantiation and execution
      myModule.initialize(
        JSON.stringify({
          lookback: 24,
          multiplier: 1.01,
          liquidityShape: "Triangle",
          bins: 5,
          poolFee: 500,
        })
      );
      // Here we pin the array to the WASM memory
      // let priceMemoryRef = myModule.__pin(
      //   myModule.__newString(JSON.stringify(prices))
      // );

      // Call the config function on the strategy bundle
      const result = myModule.execute(JSON.stringify([...dope]));

      // Pull the result from memory and parse the result
      const parsedResult = JSON.parse(result);

      // The result should match the given config
      expect(JSON.stringify(parsedResult)).toStrictEqual(
        `{\"functionName\":\"tend(uint256,(int24[],int24[],uint16[]),bytes)\",\"typesArray\":[\"uint256\",\"tuple(int24[],int24[],uint16[])\",\"bytes\"],\"valuesArray\":[10000,[[1240,1282,1324,1366,1408],[1282,1324,1366,1408,1450],[82,46,9,26,62]],\"0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000ffffffffffffffffffffffffffffffffffffffff\"]}`
      );

      expect(parsedResult.valuesArray[1][0][0]).not.toEqual(
        parsedResult.valuesArray[1][1][0]
      );
    });
  });
});
