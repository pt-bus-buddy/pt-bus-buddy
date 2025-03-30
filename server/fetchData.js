import protobuf from "protobufjs";
import fetch from "node-fetch";

// parse csv
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

// used to inspect objects and return string/data we can use
// https://www.w3schools.com/nodejs/ref_util.asp
import util from "util";

// function to get data
export async function fetchAllDatasets() {
  // variables
  const positionUrl = "https://pullmanbusbeacon.com/gtfs-rt/vehiclepositions";
  const realTimeUrl = "https://pullmanbusbeacon.com/gtfs-rt/tripupdates";
  const alertsUrl = "https://pullmanbusbeacon.com/gtfs-rt/alerts";
  const stopsUrl = "https://pullmanbusbeacon.com/gtfs";

  // fetch responses
  // NEED to use await to make sure the promise is fulfilled
  // maybe we have to switch the position based on what we want faster?
  const positionResponse = await fetch(positionUrl);
  const realTimeResponse = await fetch(realTimeUrl);
  const alertsResponse = await fetch(alertsUrl);
  const stopsResponse = await fetch(stopsUrl);

  // read the bodies
  const positionBuffer = await positionResponse.arrayBuffer();
  const realTimeBuffer = await realTimeResponse.arrayBuffer();
  const alertsBuffer = await alertsResponse.arrayBuffer();
  const stopsBuffer = await stopsResponse.arrayBuffer();

  // read stops.txt from zip
  const zip = new AdmZip(Buffer.from(stopsBuffer));
  const stopsTxt = zip.readAsText("stops.txt");

  // parse stops.txt as CSV
  const stopsRecords = parse(stopsTxt, {
    columns: true,
    skip_empty_lines: true,
  });

  // convert into position buffers
  const positionArray = new Uint8Array(positionBuffer);
  const realTimeArray = new Uint8Array(realTimeBuffer);
  const alertsArray = new Uint8Array(alertsBuffer);

  // load in the .proto file
  const root = await protobuf.load("./gtfs-realtime.proto");

  // look up feed message from our schema
  const message = root.lookupType("transit_realtime.FeedMessage");

  // decode protobuf sets
  const positionMessage = message.decode(positionArray);
  const realTimeMessage = message.decode(realTimeArray);
  const alertsMessage = message.decode(alertsArray);

  // print it out for debugging purposes
  /*
  console.log("Position Message: ");
  console.log(util.inspect(positionMessage, { depth: null, colors: true }));
  */
  /*
  console.log("Real Time Message: ");
  console.log(util.inspect(realTimeMessage, { depth: null, colors: true }));
  */
  /*
  console.log("Alerts Message: ");
  console.log(util.inspect(alertsMessage, { depth: null, colors: true }));
  */

  // debugging stops
  /*
  console.log("List of Stops:");
  stopsRecords.forEach((stop, index) => {
    console.log(
      `#${index + 1}: [${stop.stop_id}] ${stop.stop_name} (${stop.stop_lat}, ${stop.stop_lon})`,
    );
  });
  */

  // return object
  return {
    realTime: realTimeMessage,
    positions: positionMessage,
    alerts: alertsMessage,
    stops: stopsRecords,
  };
}
