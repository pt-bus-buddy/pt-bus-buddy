import { io } from "socket.io-client";

// our server from the back end
const server = io("http://localhost:3000");

// print success statement if connected
server.on("connect", () => {
  console.log("server connected!");
});

// listen for bus update sent from the server side
server.on("busUpdate", (buses) => {
  console.log("server connected!");
  // print out the bus data
  console.log("Updated bus data", buses);
});
