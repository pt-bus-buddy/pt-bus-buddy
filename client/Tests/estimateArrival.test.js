import { getBusList, calculateEstimatedArrival } from '../utils.js';


// example data
const routeShapes = {
    routeA: [
      { id: "1", lat: 34.0422, lon: -118.2337 },
      { id: "2", lat: 34.0522, lon: -118.2437 },
      { id: "3", lat: 34.0622, lon: -118.2537 },
      { id: "4", lat: 34.0722, lon: -118.2637 },
    ],
    routeB: [
      { id: "5", lat: 34.0822, lon: -118.2737 },
      { id: "3", lat: 34.0622, lon: -118.2537 },
      { id: "4", lat: 34.0722, lon: -118.2637 },
      { id: "6", lat: 34.0922, lon: -118.2837 },
    ],
  };


  const routeNames = {
    routeA: "Route A",
    routeB: "Route B",
  };
  
  const busData = [
    { number: "1", routeName: routeNames.routeA, currentStop: "2", location: { lat: 34.0522, lon: -118.2437 }, routeShape: routeShapes.routeA, averageSpeedKmh: 35 },
  { number: "2", routeName: routeNames.routeB, currentStop: "3", location: { lat: 34.0622, lon: -118.2537 }, routeShape: routeShapes.routeB, averageSpeedKmh: 40 },
  { number: "3", routeName: routeNames.routeA, currentStop: "4", location: { lat: 34.0722, lon: -118.2637 }, routeShape: routeShapes.routeA, averageSpeedKmh: 30 },
  { number: "4", routeName: routeNames.routeB, currentStop: "6", location: { lat: 34.0922, lon: -118.2837 }, routeShape: routeShapes.routeB, averageSpeedKmh: 50 },
  { number: "5", routeName: routeNames.routeA, currentStop: "1", location: { lat: 34.0422, lon: -118.2337 }, routeShape: routeShapes.routeA, averageSpeedKmh: 25 },
  { number: "6", routeName: routeNames.routeB, currentStop: "5", location: { lat: 34.0822, lon: -118.2737 }, routeShape: routeShapes.routeB, averageSpeedKmh: 45 },
  { number: "7", routeName: routeNames.routeA, currentStop: "3", location: { lat: 34.0622, lon: -118.2537 }, routeShape: routeShapes.routeA, averageSpeedKmh: 20 },
  { number: "8", routeName: routeNames.routeB, currentStop: "4", location: { lat: 34.0722, lon: -118.2637 }, routeShape: routeShapes.routeB, averageSpeedKmh: 38 },
  ];
  
  const stopId1 = "4";
  const stopId2 = "6"
  
  // Test route a
  console.log('Test Case: Route A and Stop 4 are selected by user');
  const results1 = getBusList(busData, stopId1, routeNames.routeA);
  //sorted list of arrival times of each bus
  console.log(results1); 

  // Test route b
  console.log('\nTest Case: Route B and Stop 6 are selected by user');
  const results2 = getBusList(busData, stopId2, routeNames.routeB);
  console.log(results2); 