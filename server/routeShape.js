import express from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const router = express.Router();

router.get('/:routeName', async (req, res) => {
  const routeName = req.params.routeName.toLowerCase();

  const routesPath = path.resolve('../routes.txt');
  const tripsPath = path.resolve('../trips.txt');
  const shapesPath = path.resolve('../shapes.txt');

  let routeId = null;
  let shapeId = null;

  // Find route_id from routes.txt
  await new Promise((resolve) => {
    fs.createReadStream(routesPath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.route_long_name?.toLowerCase() === routeName || row.route_short_name?.toLowerCase() === routeName) {
          routeId = row.route_id;
        }
      })
      .on('end', resolve);
  });

  if (!routeId) return res.status(404).json({ error: 'Route not found' });

  // Find shape_id from trips.txt
  await new Promise((resolve) => {
    fs.createReadStream(tripsPath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.route_id === routeId && !shapeId) {
          shapeId = row.shape_id;
        }
      })
      .on('end', resolve);
  });

  if (!shapeId) return res.status(404).json({ error: 'Shape not found' });

  // Get shape points from shapes.txt
  const shapePoints = [];
  fs.createReadStream(shapesPath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.shape_id === shapeId) {
        shapePoints.push({
          latitude: parseFloat(row.shape_pt_lat),
          longitude: parseFloat(row.shape_pt_lon),
          sequence: parseInt(row.shape_pt_sequence, 10),
        });
      }
    })
    .on('end', () => {
      shapePoints.sort((a, b) => a.sequence - b.sequence);
      res.json(shapePoints.map(({ latitude, longitude }) => ({ latitude, longitude })));
    });
});

export default router;
