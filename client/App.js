import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, Linking } from 'react-native';
import { Menu, Divider, Button, Provider, Portal } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SchedulesScreen from './SchedulesScreen';
import toggleBusLocations from './ShowBusToggle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RouteSelector from './RouteSelector';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [busLocations, setBusLocations] = useState([]);
    const [showBuses, setShowBuses] = useState(false);
    const [routeSelectorVisible, displayRouteMenuPopup] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);

    const mapRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();

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

    const zoomToUserLocation = () => {
        if (!userLocation) {
            Alert.alert('Location Services Disabled',
                'Please enable location services in your device settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
            );
        } else if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        }
    };

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

    const filterBusRoutes = (routeNumber) => {
        setSelectedRoute(routeNumber);
        if (routeNumber === null) {
            setBusLocations(prev => [...prev]);
        } else {
            setBusLocations(prev =>
                prev.filter(bus => bus.routeNumber === routeNumber)
            );
        }
        displayRouteMenuPopup(false);
    };

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
                            <Marker key={bus.id} coordinate={{ latitude: bus.position.latitude, longitude: bus.position.longitude }} title={`Bus ${bus.id}`} />
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
                                displayRouteMenuPopup(true);
                            }} title="View Bus Routes" titleStyle={{ color: 'white' }} />
                            <Divider />
                            <Menu.Item onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('Schedules');
                            }} title="Schedules" titleStyle={{ color: 'white' }} />
                            <Divider />
                            <Menu.Item
                                onPress={() => {
                                    setBusLocations([]);
                                    toggleBusLocations(showBuses, setShowBuses, setBusLocations, setMenuVisible);
                                }}
                                title={showBuses ? "Hide All Buses" : "Show All Buses"}
                                titleStyle={{ color: 'white' }}
                            />
                        </Menu>
                    </View>

                    <Portal>
                        <RouteSelector
                            visible={routeSelectorVisible}
                            onDismiss={() => displayRouteMenuPopup(false)}
                            busRouteNames={busRouteNames}
                            onRouteSelect={filterBusRoutes}
                            selectedRoute={selectedRoute}
                        />
                    </Portal>
                </View>
            </Provider>
        </GestureHandlerRootView>
    );
};

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

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    menuContainer: { position: 'absolute', top: 40, right: 20 },
});