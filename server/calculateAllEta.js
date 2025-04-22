import fs from "fs/promises";
import { fetchStatic } from "./staticData.js";
import haversine from "haversine-distance";

async function loadStaticData() {
  // fetch static data before loading file
  var staticData = await fetchStatic();

  // get file and return it parsed
  try {
    const data = await fs.readFile("./mergedStatic.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading merged static file", err);
    return null;
  }
}

export async function calculateAllEta(busPositions) {
  /*
  // get the first bus position for testing
  // stop PAR_T16 (temp)
  const tempLatitudeBus = busPositions[0].position.latitude;
  const tempLongitudeBus = busPositions[0].position.longitude;
  */

  // call our load static data function to get an object of our json
  const parsedData = await loadStaticData();
  if (!parsedData) {
    return;
  }
  for (const bus of busPositions) {
    const routeId = bus.id;

    /* extract coordinates */
    parsedData.forEach(([key, route]) => {});
  }

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
