export async function processRaw(busPositions) {
  console.log("Timestamp: ", busPositions.timestamp);
  console.log("Latitude: ", busPositions.position.latitude);
  console.log("Latitude: ", busPositions.position.longitude);
  console.log("Latitude: ", busPositions.position.bearing);
}
