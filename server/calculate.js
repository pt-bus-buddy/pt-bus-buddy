import { fetchStatic } from "./staticData.js";

export async function processRaw(busPositions) {
  // get our static data
  var staticData = await fetchStatic();
  /*
  // debugging step: printing all stops
  console.log("List of Stops:");
  staticData.stopsRecords.forEach((stop, index) => {
    console.log(
      `#${index + 1}: [${stop.stop_id}] ${stop.stop_name} (${stop.stop_lat}, ${stop.stop_lon})`,
    );
  });
  */
  /*
  // debugging step: printing all trips
  console.log("List of Trips:");
  staticData.tripsRecords.forEach((trip, index) => {
    console.log(`#${index + 1}: [${trip.trip_id}]`);
  });
  */
  /*
  // debugging step: printing all the stop times
  console.log("List of Stop Time:");
  staticData.timeRecords.forEach((entry, index) => {
    console.log(`${index + 1}: [${entry.trip_id}] Stop: ${entry.stop_id}`);
  });
  */
  /*
  // debugging step: printing all bus positions and id
  console.log("\nLive Bus Positions:");
  busPositions.forEach((bus, index) => {
    console.log(`\nBus #${index + 1} (ID: ${bus.id}) (Trip ID: ${bus.tripId})`);
    console.log("  Timestamp:", bus.timestamp);
    console.log("  Latitude: ", bus.position.latitude);
    console.log("  Longitude:", bus.position.longitude);
    console.log("  Bearing:  ", bus.position.bearing);
    console.log("  Speed:    ", bus.position.speed);
  });
  */
}
