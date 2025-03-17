// calculation and util functions here



// generates a list of all buses and their arrival times
export const getBusList = (busData, stopId, routeName) => {

 // Filter buses passing through the selected stop
 const busesAtStop = busData.filter((bus) => routeName == bus.routeName);

 // Use the calculateEstimatedArrivalTime function for each bus
   const estimatedBuses = busesAtStop.map((bus) => {
   const {estimatedMinutes, arrivalTime} = calculateEstimatedArrival(
     bus.location, // Current bus location
     bus.routeShape, // Full route shape
     stopId, // Target stop
     bus.averageSpeedKmh // Average bus speed for each bus
   );

   return {
    busNumber: bus.number,
    route: bus.routeName,
    estimatedMinutes, // Time in minutes
    arrivalTime,      // Formatted time
  };
});

// Sort buses by estimated minutes
estimatedBuses.sort((a, b) => parseFloat(a.estimatedMinutes) - parseFloat(b.estimatedMinutes));

return estimatedBuses;

}



// calculate estimated arrival time of one bus
export const calculateEstimatedArrival = (busLocation, routeShape, targetStop, averageSpeedKmh) => {
   
   
    let remainingDistance = 0;
    let busReachedStop = false;

  for (let i = 0; i < routeShape.length - 1; i++) {
    const start = routeShape[i];
    const end = routeShape[i + 1];

    // Calculate distance of the segment
    const segmentDistance = haversine(start.lat, start.lon, end.lat, end.lon);

    if (!busReachedStop) {
      if (
        (busLocation.lat >= Math.min(start.lat, end.lat) &&
          busLocation.lat <= Math.max(start.lat, end.lat)) &&
        (busLocation.lon >= Math.min(start.lon, end.lon) &&
          busLocation.lon <= Math.max(start.lon, end.lon))
      ) {
        // Calculate distance from bus to the next point
        remainingDistance += haversine(
          busLocation.lat,
          busLocation.lon,
          end.lat,
          end.lon
        );
        busReachedStop = true;
      }
    } else {
      remainingDistance += segmentDistance;
    }

    // Stop reached, break out of loop
    if (targetStop.lat === end.lat && start.lon === targetStop.lon)
    {
            break;
    }
  }
 // Calculate time in hours
 const estimatedTimeInHours = remainingDistance / averageSpeedKmh;

 // Convert to estimated time in minutes
 const estimatedTimeInMinutes = estimatedTimeInHours * 60;

 // Get current time
 const currentTime = new Date();

 // Add the estimated time to the current time
 currentTime.setMinutes(currentTime.getMinutes() + estimatedTimeInMinutes);

 // Format the arrival time as hh:mm AM/PM
 const options = { hour: '2-digit', minute: '2-digit', hour12: true };
 const arrivalTime = currentTime.toLocaleTimeString([], options);

 return {
   estimatedMinutes: estimatedTimeInMinutes.toFixed(2),
   arrivalTime: arrivalTime,
 };

  }

  
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
  }