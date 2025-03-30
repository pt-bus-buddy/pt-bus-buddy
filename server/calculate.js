// parse csv
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

// get url for stops
import fetch from "node-fetch";

export async function processRaw(busPositions) {
  // grab stops data from gtfs
  const staticUrl = "https://pullmanbusbeacon.com/gtfs";
  const staticResponse = await fetch(staticUrl);
  const staticBuffer = await staticResponse.arrayBuffer();
  // read stops.txt from zip
  const zip = new AdmZip(Buffer.from(staticBuffer));
  const stopsTxt = zip.readAsText("stops.txt");
  // parse stops.txt as CSV
  const stopsRecords = parse(stopsTxt, {
    columns: true,
    skip_empty_lines: true,
  });

  // read trip.txt from zip
  const tripsTxt = zip.readAsText("trips.txt");
  // parse as CSV
  const tripsRecords = parse(tripsTxt, {
    columns: true,
    skip_empty_lines: false,
  });

  // read stop_time.txt from zip
  const timeTxt = zip.readAsText("stop_times.txt");
  // parse as csv
  const timeRecords = parse(timeTxt, {
    columns: true,
    skip_empty_lines: false,
  });

  /*
  // debugging step: printing all stops
  console.log("List of Stops:");
  stopsRecords.forEach((stop, index) => {
    console.log(
      `#${index + 1}: [${stop.stop_id}] ${stop.stop_name} (${stop.stop_lat}, ${stop.stop_lon})`,
    );
  });
  */

  /*
  // debugging step: printing all trips
  console.log("List of Trips:");
  tripsRecords.forEach((trip, index) => {
    console.log(`#${index + 1}: [${trip.trip_id}]`);
  });
  */

  /*
  // debugging step: printing all the stop times
  console.log("List of Stop Time:");
  timeRecords.forEach((entry, index) => {
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
