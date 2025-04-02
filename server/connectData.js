import { Server } from "socket.io";
import http from "http";
import { fetchAllDatasets } from "./fetchData.js";

// http server
const server = http.createServer();
// create a socket from our http
const io = new Server(server);

// function to write data to json
export async function connectData() {
  io.on("connection", (socket) => {
    console.log("Client connected");

    const interval = setInterval(async () => {
      try {
        const data = await fetchAllDatasets();
        const busPositions = data.positions;

        const mappedData = busPositions.entity.map((bus) => ({
          id: bus.vehicle.vehicle.id,
          tripId: bus.vehicle.trip ? bus.vehicle.trip.tripId : null,
          timestamp: Date.now(),
          position: {
            latitude: bus.vehicle.position.latitude,
            longitude: bus.vehicle.position.longitude,
            speed: bus.vehicle.position.speed,
            bearing: bus.vehicle.position.bearing,
          },
        }));

        socket.emit("busUpdate", mappedData);
      } catch (err) {
        console.error("Error fetching or emitting bus data:", err);
      }
    }, 5000);
    socket.on("disconnect", () => {
      console.log("Client disconnected!");
      clearInterval(interval);
    });
  });
}

server.listen(3000, () => {
  console.log("WebSocket server running on port 3000");
});
