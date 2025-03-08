// axios required for making api requests
const axios = require('axios');

// protobuf is used to parse data from gtfs-realtime data
const protobuf = require('protobufjs');

// 3 GTFS realtime links that can provide information in REALTIME!
const VEHICLE_POS_URL = 'https://pullmanbusbeacon.com/gtfs-rt/vehiclepositions';
const TRIP_UPDATES_URL = 'https://pullmanbusbeacon.com/gtfs-rt/tripupdates';
const BUS_ALERTS_URL = 'https://pullmanbusbeacon.com/gtfs-rt/alerts';


