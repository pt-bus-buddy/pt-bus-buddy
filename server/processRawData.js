// connects from the raw data sent out and processes it
import { io } from "socket.io-client";
import { Server } from "socket.io";
import { calculateAllEtaTemp } from "./calculateAllEtaTemp.js";
import http from "http";

// create our client and server socket
const clientIO = io("http://localhost:3000");
const httpServer = new http.createServer();
const serverIO = new Server(httpServer);

export async function processRawData() {
  // on connection of our client
  clientIO.on("busUpdate", (rawData) => {
    calculateAllEtaTemp(rawData);
  });
}
