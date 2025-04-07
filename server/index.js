import { rawBusSocket } from "./rawBusSocket.js";
import { processRawData } from "./processRawData.js";
// catch error
run().catch((err) => console.log(err));

// function to get data
async function run() {
  // run our raw bus socket
  rawBusSocket();
  // process it
  processRawData();
}
