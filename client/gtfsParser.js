import Papa from 'papaparse';
import { Asset } from 'expo-asset';

const parseGTFSFile = async (filename) => {
    try {
        const asset = await Asset.loadAsync(require(`../routeData/${filename}`));
        const response = await fetch(asset[0].localUri);
        const text = await response.text();
        return Papa.parse(text, { header: true }).data;
    } catch (error) {
        console.error(`Error parsing ${filename}:`, error);
        throw error;
    }
};

export const loadGTFSData = async () => {
    try {
        const [routes, shapes, stops, stopTimes] = await Promise.all([
            parseGTFSFile('routes.txt'),
            parseGTFSFile('shapes.txt'),
            parseGTFSFile('stops.txt'),
            parseGTFSFile('stop_times.txt'),
        ]);

        if (!routes || !shapes || !stops || !stopTimes) {
            throw new Error('Missing required GTFS files');
        }

        return { routes, shapes, stops, stopTimes };
    } catch (error) {
        console.error('Failed to load GTFS data:', error);
        throw error;
    }
};

export const processRouteData = (routeId, gtfsData) => {
    const { routes, shapes, stops, stopTimes } = gtfsData;

    const routeShapes = shapes
        .filter(shape => shape.shape_id === routeId)
        .sort((a, b) => parseInt(a.shape_pt_sequence) - parseInt(b.shape_pt_sequence))
        .map(shape => ({
            latitude: parseFloat(shape.shape_pt_lat),
            longitude: parseFloat(shape.shape_pt_lon),
        }));

    const routeStops = stopTimes
        .filter(st => st.trip_id.includes(routeId))
        .sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence))
        .map(st => {
            const stop = stops.find(s => s.stop_id === st.stop_id);
            return stop ? {
                id: stop.stop_id,
                name: stop.stop_name,
                latitude: parseFloat(stop.stop_lat),
                longitude: parseFloat(stop.stop_lon),
            } : null;
        })
        .filter(Boolean);

    const routeInfo = routes.find(r => r.route_id === routeId);

    return {
        shapes: routeShapes,
        stops: routeStops,
        color: `#${routeInfo?.route_color || '273695'}`,
        name: routeInfo?.route_short_name || `Route ${routeId}`,
    };
};