import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Menu, Divider, Button, Provider } from 'react-native-paper'; // for buttons
import MapView, { Marker } from 'react-native-maps'; // for displaying user location pin
import * as Location from 'expo-location'; // for finding user location

// main frontend app function
export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      // request user location when app is launched
      let { status } = await Location.requestForegroundPermissionsAsync();

      // we can only continue if the user enables location services...add error handling here?
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

    })();
  }, []);

 // Zooms to the user's location; this function will be invoked when the "My location" button is selected
  const zoomToUserLocation = () => {
    if (mapRef.current && userLocation) {
      // zoom animation that hones in on the user's pin
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // Zooms back to the main bus route map; used when going in between user's location and the main route map
  const viewBusRoutes = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        // Pullman coordinates
        latitude: 46.7300,
        longitude: -117.1740,
        latitudeDelta: 0.065,
        longitudeDelta: 0.04,
      }, 1000);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}

          // these coordinates dictate where on the map the app renders initially
          initialRegion={{
            latitude: 46.7300,
            longitude: -117.1740,
            latitudeDelta: 0.065, // for lat delta and long delta, lower vals = more zoomed in on initial render
            longitudeDelta: 0.04,
          }}
          showsUserLocation={true}
        >
          {userLocation && <Marker coordinate={userLocation} />}
        </MapView>

        {/* a barebones drop down menu, we can add to this as we add features */}
        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="contained" onPress={() => setMenuVisible(true)} 
              // background color of menu when initially displayed
                style={{ backgroundColor: 'black', marginTop: 15 }}> 
                Menu
              </Button>
            }
            contentStyle={{ backgroundColor: 'black' }} // background color of menu when pressed
          
          // only 2 menu items so far, options to zoom to the user's current location and to view the main bus route map (centered on pullman)
          // we can add to this as we add favorite routes, plan trip etc. features.
          >
            <Menu.Item onPress={zoomToUserLocation} title="Zoom to My Location" titleStyle={{ color: 'white' }} />
            <Divider />
            <Menu.Item onPress={viewBusRoutes} title="View Map" titleStyle={{ color: 'white' }} />
          </Menu>
        </View>
      </View>
    </Provider>
  );
}

// main layout of the map and any buttons defined here
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // map should take up the entire screen (100%)
  map: {
    width: '100%',
    height: '100%',
  },
  // position of the dropdown menu button
  menuContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

