import { Server } from "socket.io";
import http from "http";
import { fetchAllDatasets } from "./fetchData.js";

// http server
const server = http.createServer();
// create a socket from our http
const io = new Server(server);

// function to write data to json
export async function connectData() {
  // debug method:
  // check the name of the second object
  console.log("Nested object #1: ", busPositions.entity);
  console.log("Nested object #2: ", busPositions.header);
  // first get the # of objects within our main object
  // first # are the buses
  const busSize = Object.keys(busPositions.entity).length;
  console.log("# of buses: ", busSize);

  // second # are the messages for each bus
  // contains additional information
  const messageSize = Object.keys(busPositions.header).length;
  console.log("# of messages for each bus: ", messageSize);

  // debug: print out
  /*
  busPositions.entity.forEach((bus, index) => {
    console.log(`Bus ${index + 1}: `, bus.vehicle.vehicle.id);
    console.log(
      `Bus ${index + 1} Position Latitude: `,
      bus.vehicle.position.latitude,
    );
    console.log(
      `Bus ${index + 1} Position Longitude: `,
      bus.vehicle.position.longitude,
    );
  });
  */

  io.on("connection", (socket) => {
    console.log("Client connected");

    const interval = setInterval(async () => {
      try {
        const data = await fetchAllDatasets();
        const busPositions = data.positions;

        const mappedData = busPositions.entity.map((bus) => ({
          id: bus.vehicle.vehicle.id,
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
