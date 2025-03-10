export function processPositionData(rawPositions) {
  const busData = rawPositions.entity.reduce((acc, entity) => {
    if (entity.vehicle) {
      const busID = entity.vehicle.vehicle?.id || entity.id;
    }
  });
}
