import express from "express";
import axios from "axios";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

const app = express();
const PORT = 5001;

app.get("/api/vehiclepositions", async (req, res) => {
  try {
    // Fetch GTFS-RT data
    const response = await axios.get(
      "https://pullmanbusbeacon.com/gtfs-rt/vehiclepositions",
      {
        responseType: "arraybuffer", // Important for binary data
      },
    );

    // Decode the Protocol Buffers feed
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      response.data,
    );

    // Extract and send vehicle positions
    const vehiclePositions = feed.entity.map((entity) => ({
      id: entity.id,
      position: entity.vehicle.position,
      trip: entity.vehicle.trip,
      timestamp: entity.vehicle.timestamp,
    }));

    res.json(vehiclePositions);
  } catch (error) {
    console.error("Error fetching GTFS-RT data:", error.message);
    res.status(500).json({ error: "Failed to fetch GTFS-RT data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
