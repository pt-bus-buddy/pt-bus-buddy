// realtime.js
/*
 * Change from JSON to ProtoBuf
 *
 * /

import express from "express";
import axios from "axios";
import gtfsMessage from "gtfs-realtime-bindings";
import protobuf from "protobufjs";

const {
  transit_realtime: { FeedMessage },
} = gtfsMessage;

// Define the GTFS Realtime URLs
const VEHICLE_POSITIONS_URL =
  "https://pullmanbusbeacon.com/gtfs-rt/vehiclepositions";
const TRIP_UPDATES = "https://pullmanbusbeacon.com/gtfs-rt/tripupdates";
const ALERTS = "https://pullmanbusbeacon.com/gtfs-rt/alerts";

const app = express();
const PORT = 5001;

/**
 * Fetch and parse a GTFS realtime feed
 * @param {string} url - The URL of the GTFS Realtime feed
 * @returns {Promise<Buffer>} - Returns a plain JavaScript object representation of the feed
 */
const fetchGTFSRealTime = async (url) => {
  try {
    console.log(`Fetching GTFS Realtime data from ${url}`);
    const response = await axios.get(url, { responseType: "arraybuffer" });
    console.log("Data fetched successfully");

    return Buffer.from(response.data);
  } catch (error) {
    // Use backticks for template literals and fix the syntax error
    console.log(
      `Error fetching GTFS Realtime data from ${url}: ${error.message}`,
    );
    throw error;
  }
};

// Route to fetch Vehicle Positions
app.get("/vehicle-positions", async (req, res) => {
  console.log("Received request for /vehicle-positions");
  try {
    const vehiclePositions = await fetchGTFSRealTime(VEHICLE_POSITIONS_URL);
    console.log("Sending vehicle positions data");
    res.json(vehiclePositions);
  } catch (error) {
    console.error("Error in /vehicle-positions route:", error.message);
    res.status(500).json({ error: "Failed to fetch vehicle positions" });
  }
});

app.get("/trip-updates", async (req, res) => {
  console.log("Received request for /trip-updates");
  try {
    const tripUpdates = await fetchGTFSRealTime(TRIP_UPDATES);
    console.log("Sending trip updates data");
    res.json(tripUpdates);
  } catch (error) {
    console.error("Error in /trip-updates route:", error.message);
    res.status(500).json({ error: "Failed to fetch trip updates" });
  }
});

app.get("/alerts", async (req, res) => {
  console.log("Received request for /alerts");
  try {
    const alerts = await fetchGTFSRealTime(ALERTS);
    console.log("Sending alerts data");
    res.json(alerts);
  } catch (error) {
    console.error("Error in /alerts route:", error.message);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
