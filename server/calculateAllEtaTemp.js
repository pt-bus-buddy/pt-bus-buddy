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

export async function calculateAllEtaTemp(busPositions) {
  // for each bus, calculate the positions
  for (const bus of busPositions) {
    const dummyStop = {
      stop_name: "Nearest Stop",
      stop_lat: 46.731, // hardcoded coordinates
      stop_lon: -117.165,
    };

    const etaInMinutes = Math.floor(Math.random() * 5) + 1; // random 1–5 min

    console.log(`Bus ${bus.id}:`);
    console.log(
      `  Current Location: (${bus.position.latitude}, ${bus.position.longitude})`,
    );
    console.log(`  Approaching Stop: ${dummyStop.stop_name}`);
    console.log(`  ETA : ${etaInMinutes} minute(s)\n`);
  }
}
