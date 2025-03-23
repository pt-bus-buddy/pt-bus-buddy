import { Client } from "socket.io-client";

// PROCESS:
// Get the positions AND the calculated time of arrival per stop
// our server from the back end
const client = new Client("http://localhost:3000");

// print success statement if connected
client.on("connect", () => {
  console.log("server connected!");
});

// listen for bus update sent from the server side
client.on("busUpdate", (buses) => {
  console.log("server connected!");
  // print out the bus data
  console.log("Raw bus data", buses);
});
