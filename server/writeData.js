import fs from "fs";

// function to write data to json
export async function writeData(busPositions) {
  // since busPositions is of object type, we want to stringify it
  // but since it will just print out a giant string, we want to parse each item type

  // first get the # of objects within our main object
  const keySize = Object.keys(busPositions).length;
  console.log("# of keys: ", keySize);

  // set keys

  // loop through each object and stringify it
  /*
  for (var i = 0; i < keySize; ++i) {
    const temp = JSON.stringify(Object.keys(busPositions));
    console.log("Testing Value: ", temp);
  }
  fs.writeFile("data.json", busPositions, function (err) {
    if (err) {
      console.log("Error writing bus positions to file.");
    }
    console.log("Successfully wrote bus positions to file.");
  });
  */
}
