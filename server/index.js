import { fetchAllDatasets } from "./fetchData.js";
import { connectData } from "./connectData.js";
// catch error
run().catch((err) => console.log(err));

// function to get data
async function run() {
  // fetch the data sets
  const { positions, realTime, alerts } = await fetchAllDatasets();

  // connect it with web sockets
  connectData(positions);
}