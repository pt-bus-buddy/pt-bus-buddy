import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Menu, Divider, Button, Provider, Dialog, Portal, Text } from 'react-native-paper'; // for popup menu to display bus route options
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SchedulesScreen from './SchedulesScreen';
import toggleBusLocations from './ShowBusToggle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null); // for User's location beacon
    const [menuVisible, setMenuVisible] = useState(false); // state object for menu visibility
    const [busLocations, setBusLocations] = useState([]);  
    const [showBuses, setShowBuses] = useState(false);
    const [routeDialogVisible, displayRouteMenuPopup] = useState(false); // dictates whether the routes popup to visible or not
    const [selectedRoute, setSelectedRoute] = useState(null); // use this useState to filter the map display by bus route

    const mapRef = useRef(null);

    // Prompts the user to turn on location services upon opening the app
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    // Zooms to the user's location which is attained using the Google Maps API
    const zoomToUserLocation = () => {
        if (mapRef.current && userLocation) {
            mapRef.current.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

    // Zooms to the main Pullman area map where the bus routes are displayed
    const zoomOnMap = () => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: 46.7300,
                longitude: -117.1740,
                latitudeDelta: 0.065,
                longitudeDelta: 0.04,
            }, 1000);
        }
    };

    // Function invoked when a user selects a bus route from the Bus Routes list menu. Needs to be completed!
    const filterBusRoutes = (routeNumber) => {
        setSelectedRoute(routeNumber);
        
        // starter logic for filtering the bus route being displayed, update this when actually implementing this feature
        setBusLocations(prev =>
            prev.filter(bus => bus.routeNumber === routeNumber)
        );
        displayRouteMenuPopup(false);
    };

    // All possible busses that are operating, could change the number to the actual bus ID for easy lookup
    const busRouteNames = [
        { number: 1, name: 'Campus Route' },
        { number: 2, name: 'Blue Route' },
        { number: 3, name: 'Loop Route' },
        { number: 4, name: 'Apartmentland Express' },
        { number: 5, name: 'Silver Route' },
        { number: 6, name: 'Paradise Route' },
        { number: 7, name: 'Wheat Route' },
        { number: 8, name: 'Lentil Route' },
      ];      

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider>
                <View style={styles.container}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            latitude: 46.7300,
                            longitude: -117.1740,
                            latitudeDelta: 0.065,
                            longitudeDelta: 0.04,
                        }}
                        showsUserLocation={true}
                    >
                        {userLocation && <Marker coordinate={userLocation} title="Your Location" />}
                        {busLocations.map(bus => (
                            // Marker label for static bus locations
                            <Marker
                                key={bus.id}
                                coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
                                title={`Bus ${bus.id} | Route ${bus.routeNumber}`}
                            />
                        ))}
                    </MapView>
                    
                    <View style={styles.menuContainer}>
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <Button mode="contained" onPress={() => setMenuVisible(true)} style={{ backgroundColor: 'black', marginTop: 15 }}>
                                    Menu
                                </Button>
                            }
                            contentStyle={{ backgroundColor: 'black' }}
                        >
                            <Menu.Item onPress={zoomToUserLocation} title="Zoom to My Location" titleStyle={{ color: 'white' }} />
                            <Divider />
                            <Menu.Item onPress={zoomOnMap} title="View Map" titleStyle={{ color: 'white' }} />
                            <Divider />
                            <Menu.Item onPress={() => {
                                setMenuVisible(false);
                                displayRouteMenuPopup(true); // Display the menu of routes for the user to choose from
                            }} title="View Bus Routes" titleStyle={{ color: 'white' }} />
                            <Divider />
                            <Menu.Item onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('Schedules');
                            }} title="Schedules" titleStyle={{ color: 'white' }} />
                            <Divider />
                            <Menu.Item
                                onPress={() => toggleBusLocations(showBuses, setShowBuses, setBusLocations, setMenuVisible)}
                                title={showBuses ? "Hide All Buses" : "Show All Buses"}
                                titleStyle={{ color: 'white' }}
                            />
                        </Menu>
                    </View>

                    {/* 
                        Menu Popup for displaying all bus routes. After this feature, each bus route will be linked
                        to a function that only displays that route and its corresponding busses.
                    */}
                    <Portal>
                        <Dialog visible={routeDialogVisible} onDismiss={() => displayRouteMenuPopup(false)}>
                            <Dialog.Title>Select a Bus Route</Dialog.Title>
                            <Dialog.ScrollArea>
                                <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                                    {busRouteNames.map((route) => (
                                        <Button
                                            key={route.number}
                                            mode="outlined"
                                            style={styles.routeButton}
                                            labelStyle={{ color: 'black' }}
                                            onPress={() => filterBusRoutes(route.number)}
                                        >
                                            {route.name}
                                        </Button>
                                    ))}
                                </ScrollView>
                            </Dialog.ScrollArea>
                            <Dialog.Actions>
                                <Button 
                                labelStyle={{ color: 'black' }}
                                onPress={() => displayRouteMenuPopup(false)}
                                    >
                                        Close
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                </View>
            </Provider>
        </GestureHandlerRootView>
    );
};

// Main app function. The navigator switches between the listed Stack.Screen objects
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pullman Transit Bus Buddy' }} />
                <Stack.Screen name="Schedules" component={SchedulesScreen} options={{ title: 'Schedules' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Style parameters for the map, menu button/container, and buttons for each of the bus routes in the filtering 
// feature
const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    menuContainer: { position: 'absolute', top: 40, right: 20 },
    routeButton: {
        marginVertical: 6,
    },
});
