import { Server } from "socket.io";
import http from "http";
import { fetchLiveBusData } from "./fetchLiveBusData.js";

// http server
const server = http.createServer();
// create a socket from our http
const io = new Server(server);

// socket to connect our bus positions
export async function rawBusSocket() {
  io.on("connection", (socket) => {
    console.log("Client connected");

    const interval = setInterval(async () => {
      try {
        const data = await fetchLiveBusData();
        const busPositions = data.positions;

        // Debug: log buses with missing position data
        busPositions.entity.forEach((bus) => {
          if (!bus.vehicle?.position) {
            console.warn(
              "Skipping bus with missing position:",
              bus.vehicle?.vehicle?.id,
            );
          }
        });

        const mappedData = busPositions.entity
          .filter((bus) => bus.vehicle?.position != null)
          .map((bus) => ({
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
