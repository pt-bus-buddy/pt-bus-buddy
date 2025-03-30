import { connectData } from "./connectData.js";
import { fetchAllDatasets } from "./fetchData.js";
import { processData } from "./processData.js";
// catch error
run().catch((err) => console.log(err));

// function to get data
async function run() {
  // connect it with web sockets
  connectData();
  // process it
  processData();
}
