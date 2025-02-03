import protobuf from "protobufjs";
import fetch from "node-fetch";

// catch error
run().catch((err) => console.log(err));

// function to get data
async function run() {
  // variables
  const url = "https://pullmanbusbeacon.com/gtfs-rt/vehiclepositions";

  // fetch data from url
  // NEED to use await to make sure the promise is fulfilled
  const response = await fetch(url);

  // convert into array buffer
  const buffer = await response.arrayBuffer();
  const uint8array = new Uint8Array(buffer);

  // load in the .proto file
  const root = await protobuf.load("./gtfs-realtime.proto");
  //lookup feed message
  const feedMessage = root.lookupType("transit_realtime.FeedMessage");

  //decode the data into an object
  const message = feedMessage.decode(uint8array);

  console.log(message);
}
