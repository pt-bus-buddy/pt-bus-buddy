
import { connectData } from "./connectData.js";
// catch error
run().catch((err) => console.log(err));

// function to get data
async function run() {
  // connect it with web sockets
  connectData();
}