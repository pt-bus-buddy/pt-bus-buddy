import React, { useState, useEffect } from 'react'; // use state and use effect used for hooks to get user location
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
// Main display app for the frontend
export default function App() {
  // Store the user's current location via use state hook
  const [userLocation, setUserLocation] = useState(null);

  // After the component mounts to the DOM, get user's location
  useEffect(() => {
    // Use the geolocation google maps API to get the user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error("There was an error getting geolocation: ", error);
      }
    );

  }, []);

  // While we don't have access to the user's location, just display loading message
  // May need to add error handling for if user doesn't have location services on
  if (!userLocation) {
    return <View style={styles.container}><Text>Location loading...</Text></View>; // Show loading text until location is available
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}

        // Pullman is the initial region (these are coords for pullman)
        initialRegion={{
          latitude: 46.7300,
          longitude: -117.1540,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true} // Optionally show the user's location on the map
      >
        <Marker userPosition={userLocation} /> {/* Marker at the user's location */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
