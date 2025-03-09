import protobuf from "protobufjs";
import fetch from "node-fetch";

<<<<<<< HEAD
// catch error
run().catch((err) => console.log(err));

// function to get data
async function run() {
  // variables
  const positionUrl = "https://pullmanbusbeacon.com/gtfs-rt/vehiclepositions";
  const realTimeUrl = "https://pullmanbusbeacon.com/gtfs-rt/tripupdates";
  const alertsUrl = "https://pullmanbusbeacon.com/gtfs-rt/alerts";

  // fetch responses
  // NEED to use await to make sure the promise is fulfilled
  // maybe we have to switch the position based on what we want faster?
  const positionResponse = await fetch(positionUrl);
  const realTimeResponse = await fetch(realTimeUrl);
  const alertsResponse = await fetch(alertsUrl);

  // read the bodies
  const positionBuffer = await positionResponse.arrayBuffer();
  const realTimeBuffer = await realTimeResponse.arrayBuffer();
  const alertsBuffer = await alertsResponse.arrayBuffer();

  // convert into position buffers
  const positionArray = new Uint8Array(positionBuffer);
  const realTimeArray = new Uint8Array(realTimeBuffer);
  const alertsArray = new Uint8Array(alertsBuffer);

=======
// used to inspect objects and return string/data we can use
// https://www.w3schools.com/nodejs/ref_util.asp
import util from "util";

// catch error
run().catch((err) => console.log(err));

// function to get data
async function run() {
  // variables
  const positionUrl = "https://pullmanbusbeacon.com/gtfs-rt/vehiclepositions";
  const realTimeUrl = "https://pullmanbusbeacon.com/gtfs-rt/tripupdates";
  const alertsUrl = "https://pullmanbusbeacon.com/gtfs-rt/alerts";

  // fetch responses
  // NEED to use await to make sure the promise is fulfilled
  // maybe we have to switch the position based on what we want faster?
  const positionResponse = await fetch(positionUrl);
  const realTimeResponse = await fetch(realTimeUrl);
  const alertsResponse = await fetch(alertsUrl);

  // read the bodies
  const positionBuffer = await positionResponse.arrayBuffer();
  const realTimeBuffer = await realTimeResponse.arrayBuffer();
  const alertsBuffer = await alertsResponse.arrayBuffer();

  // convert into position buffers
  const positionArray = new Uint8Array(positionBuffer);
  const realTimeArray = new Uint8Array(realTimeBuffer);
  const alertsArray = new Uint8Array(alertsBuffer);

>>>>>>> darron
  // load in the .proto file
  const root = await protobuf.load("./gtfs-realtime.proto");

  // look up feed message from our schema
  const message = root.lookupType("transit_realtime.FeedMessage");

  // decode protobuf sets
  const positionMessage = message.decode(positionArray);
  const realTimeMessage = message.decode(realTimeArray);
  const alertsMessage = message.decode(alertsArray);

<<<<<<< HEAD
  console.log("Position Message: ", positionMessage);
  console.log("Real Time Message: ", realTimeMessage);
  console.log("Alerts Messages: ", alertsMessage);
=======
  console.log("Position Message: ");
  console.log(util.inspect(positionMessage, { depth: null, colors: true }));
  console.log("Real Time Message: ", realTimeMessage);
  console.log(util.inspect(realTimeMessage, { depth: null, colors: true }));
  console.log("Alerts Messages: ", alertsMessage);
  console.log(util.inspect(alertsMessage, { depth: null, colors: true }));
>>>>>>> darron
}
