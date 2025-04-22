import { fetchStatic } from "./staticData";

// PSEUDO:
// find matching trip times based on inputted tripID
// STOPS contains the coordinates
// STOP TIMES contains the trip id and STOP ID!!
// TRIPS contains the trip id
// connection logic: TRIP + STOPS => STOP TIMES => MATCHING COORDINATES DEPENDING ON BUS COORDS
export async function findMatchingTrip(busCoords, tripId) {
  // get our records
  const { stopRecords, tripRecords, stopTimeRecords } = await fetchStatic();

  // get stop times for that tripId (only if valid)
  const stopTimesForTrip = stopTimeRecords
    .filter((record) => record.trip_id == tripId)
    .sort((a, b) => Number(a.stop_sequence) - Number(b.stop_seqeunce));

  // check if stop time id was found
  if (stopTimesForTrip.length === 0) {
    console.error("Error: no trips found for ${tripID}");
  } else {
    console.log("All stop times: ${stopTimesForTrip}");
  }
}
