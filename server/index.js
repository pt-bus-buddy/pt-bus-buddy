import { fetchAllDatasets } from "./fetchData.js";
import { processData } from "./processData.js";
import { writeData } from "./writeData.js";
// catch error
run().catch((err) => console.log(err));

// function to get data
async function run() {
  // fetch the data sets
  const { positions, realTime, alerts } = await fetchAllDatasets();

  processData(positions);

  // writeData(positions);
}
