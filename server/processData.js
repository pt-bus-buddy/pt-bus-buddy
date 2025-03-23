// connects from the raw data sent out and processes it
import { Client } from "socket.io-client";
import { Server } from "socket.io";
import http from "http";

// create our client and server socket
const clientIO = Client("http://localhost:3000");
const httpServer = new http.createServer();
const serverIO = Server(httpServer);

export async function processData(busPositions) {
  // on connection of our client
  clientIO.on("busUpdate", (rawData) => {
    // we then want to process our data here
    processData(rawData);
  });
}
