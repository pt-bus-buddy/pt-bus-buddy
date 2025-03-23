export async function processRaw(busPositions) {
  /*
        busPositions.entity.map((bus) => ({
          id: bus.vehicle.vehicle.id,
          timestamp: Date.now(),
          position: {
            latitude: bus.vehicle.position.latitude,
            longitude: bus.vehicle.position.longitude,
            speed: bus.vehicle.position.speed,
            bearing: bus.vehicle.position.bearing,
          },
          */
  const positions = busPositions.entity.map((bus) => ({
    positions: {
      latitude: bus.vehicle.position.latitude,
      longitude: bus.vehicle.position.longitude,
      speed: bus.vehicle.position.speed,
      bearing: bus.vehicle.position.bearing,
    },
  }));
  console.log("Process Raw Function (latitude): ", positions.latitude);
  console.log("Process Raw Function (longitude): ", positions.longitude);
  console.log("Process Raw Function (speed): ", positions.speed);
}
