import {getBusList, calculateEstimatedArrival } from '../utils.js'

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
  
  const busData = [
    { number: "1", routeName: "Route A", currentStop: "2", location: { lat: 34.0522, lon: -118.2437 }, stops: ["1", "2", "3", "4"], averageSpeedKmh: 35 },
    { number: "2", routeName: "Route B", currentStop: "3", location: { lat: 34.0622, lon: -118.2537 }, stops: ["5", "3", "4", "6"], averageSpeedKmh: 40, },
  ];
  
  const stopId = "4";
  
  
  // Test cases
  console.log('Test Case: Multiple Routes Through Stop 4');
  const results = getNextBuses(stopId, busData, routeShapes);
  console.log(results); // This should log the sorted list of buses with their estimated arrival times