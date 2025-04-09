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

  // store necessary stop time into our dataMap
  stopTimeRecords
    .filter((record) => {
      // debug statement:
      console.log("Checking record: ", record);
      return record.trip_id && record.stop_id;
    })
    .forEach((record) => {
      // set the key to be the trip id, which then maps to the trip and stop id
      dataMap.set(record.trip_id, {
        trip_id: record.trip_id,
        stop_id: record.stop_id,
      });
    });

  /* debug statement 
  // of since dataMap is an iterable value and not enumerated
  for (const [key, value] of dataMap) {
    console.log("Key: ", key, "Value: ", value);
  }
  */
}

combineStatic().catch((err) => {
  console.log("combine static err: ", err);
});
