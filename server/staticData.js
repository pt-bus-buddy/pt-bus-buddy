// parse csv
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

// get url for stops
import fetch from "node-fetch";

// combine the data into one mega file for easier bus lookup
export async function fetchStatic() {
  // grab stops data from gtfs
  const staticUrl = "https://pullmanbusbeacon.com/gtfs";
  const staticResponse = await fetch(staticUrl);
  const staticBuffer = await staticResponse.arrayBuffer();
  // read stops.txt from zip
  const zip = new AdmZip(Buffer.from(staticBuffer));
  const stopsTxt = zip.readAsText("stops.txt");
  // parse stops.txt as CSV
  const stopRecords = parse(stopsTxt, {
    columns: true,
    skip_empty_lines: true,
  });

  // read trip.txt from zip
  const tripsTxt = zip.readAsText("trips.txt");
  // parse as CSV
  const tripRecords = parse(tripsTxt, {
    columns: true,
    skip_empty_lines: false,
  });

  // read stop_time.txt from zip
  const timeTxt = zip.readAsText("stop_times.txt");
  // parse as csv
  const stopTimeRecords = parse(timeTxt, {
    columns: true,
    skip_empty_lines: false,
  });

  return {
    stopRecords,
    tripRecords,
    stopTimeRecords,
  };
}
