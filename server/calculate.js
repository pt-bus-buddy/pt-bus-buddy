// parse csv
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

// get url for stops
import fetch from "node-fetch";

export async function processRaw(busPositions) {
  // grab data from gtfs
  const stopsUrl = "https://pullmanbusbeacon.com/gtfs";
  const stopsResponse = await fetch(stopsUrl);
  const stopsBuffer = await stopsResponse.arrayBuffer();
  // read stops.txt from zip
  const zip = new AdmZip(Buffer.from(stopsBuffer));
  const stopsTxt = zip.readAsText("stops.txt");
  // parse stops.txt as CSV
  const stopsRecords = parse(stopsTxt, {
    columns: true,
    skip_empty_lines: true,
  });

  // debugging step: printing all stops
  console.log("List of Stops:");
  stopsRecords.forEach((stop, index) => {
    console.log(
      `#${index + 1}: [${stop.stop_id}] ${stop.stop_name} (${stop.stop_lat}, ${stop.stop_lon})`,
    );
  });
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
}
