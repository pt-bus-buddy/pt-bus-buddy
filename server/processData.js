import util from "util";
// function to process the data we fetched
// currently only focusing on bus tracking based on positions
// we can see the data from the terminal
export async function processData(busPositions) {
  // remove the nested objects
  console.log("Position Message Before Removal: ");
  console.log(util.inspect(busPositions, { depth: null, colors: true }));

  // removal functionality
  delete busPositions.entity.FeedEntity;
  console.log("Position Message After Removal: ");
  console.log(util.inspect(busPositions, { depth: null, colors: true }));

  // remove vehicle index
  console.log("Removed vehicle 7183: ");
  const indexToRemove = busPositions.entity.findIndex(
    (entity) => entity.id === "vehicle_7183",
  );

  if (indexToRemove !== -1) {
    busPositions.entity.splice(indexToRemove, 1);
  }
  console.log(util.inspect(busPositions, { depth: null, colors: true }));
}
