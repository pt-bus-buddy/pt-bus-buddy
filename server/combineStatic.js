import { fetchStatic } from "./staticData.js";
import fs from "fs";

// PSEUDO:
// STOPS contains the coordinates
// STOP TIMES contains the trip id and STOP ID!!
// TRIPS contains the trip id
// connection logic: TRIP + STOPS => STOP TIMES => MATCHING COORDINATES DEPENDING ON BUS COORDS
// match all connecting trips into one big file
export async function combineStatic() {
  // get our records
  const { stopRecords, tripRecords, stopTimeRecords } = await fetchStatic();
  /* Debug Statements:
  console.log("Fetched static data:");
  console.log("stopRecords:", stopRecords?.length);
  console.log("tripRecords:", tripRecords?.length);
  console.log("stopTimeRecords:", stopTimeRecords?.length);
  */

  // create a map to merge by id
  let dataMap = new Map();
  // map to store <trip_id, stop_id>
  let tripKeyMap = new Map();
  // map to store <stop_id, trip_id>
  let stopKeyMap = new Map();

  // store necessary stop time into our dataMap

  // actually, what we can do is create another map where we map the trip id to stop id, and vice versa in order to fill in the missing key for the later records.
  stopTimeRecords
    .filter((record) => {
      /* debug statement:
      console.log("Checking record: ", record);
      */
      return record.trip_id && record.stop_id;
    })
    .forEach((record) => {
      // let key = [record.trip_id, record.stop_id];
      let key = `${record.trip_id}-${record.stop_id}`;
      // set the key to be the trip id AND stop id
      dataMap.set(key, {
        trip_id: record.trip_id,
        stop_id: record.stop_id,
      }),
        // store the additional keys since trip records and stop records have missing ids
        tripKeyMap.set(record.trip_id, record.stop_id);
      stopKeyMap.set(record.stop_id, record.trip_id);
    });

  // store necessary trip records into our data map
  tripRecords
    .filter((record) => {
      return record.route_id;
    })
    .forEach((record) => {
      // i know that tripRecords does NOT contain a stop id
      let stopKey = tripKeyMap.get(record.trip_id);
      let key = `${record.trip_id}-${stopKey}`;
      // get the already existing key (or none) since we populated it with stopTime
      let existing = dataMap.get(key.startsWith(key));
      // for each record's trip id as our key, add the route_id as well
      dataMap.set(key, {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        // apply spread syntax to iterate OVER the existing elements and generate new pairs
        ...existing,
        route_id: record.route_id,
      });
    });

  // store necessary stop records into our data map
  stopRecords
    .filter((record) => {
      return record.stop_name && record.stop_lat && record.stop_lon;
    })
    .forEach((record) => {
      // i know that stopRecords does NOT contain a trip id
      let tripKey = stopKeyMap.get(record.stop_id);
      let key = `${tripKey}-${record.stop_id}`;
      // get the already existing key (or none) since we populated it with stopTime
      let existing = dataMap.get(key.endsWith(key));
      dataMap.set(key, {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        // apply spread syntax to iterate OVER the existing elements and generate new pairs
        ...existing,
        stop_name: record.stop_name,
        stop_lat: record.stop_lat,
        stop_lon: record.stop_lon,
      });
    });

  /* Debug Statement
  // of since dataMap is an iterable value and not enumerated
  for (const [key, value] of dataMap) {
    // split our id
    const [trip_id, stop_id] = key.split("-");
    console.log(
      "Key(TripID): ",
      trip_id,
      "Key(StopID): ",
      stop_id,
      "Data: ",
      value,
    );
  }
  */

  // now we can write to file

  // first convert map to array of key value pairs
  const mapArray = Array.from(dataMap.entries());
  // convert to json string
  const jsonString = JSON.stringify(mapArray, null, 2);

  // write to file
  fs.writeFileSync("./mergedStatic.json", jsonString);
}

combineStatic().catch((err) => {
  console.log("combine static err: ", err);
});
