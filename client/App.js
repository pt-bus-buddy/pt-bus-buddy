import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Alert, Linking, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Menu, Divider, Button, Provider, Dialog, Portal, Text, IconButton } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Papa from 'papaparse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SchedulesScreen from './SchedulesScreen';
import toggleBusLocations from './ShowBusToggle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

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

// route name ? shape_id
const routeToShapeId = {
    'Campus Route': '25001',
    'Blue Route': '24999',
    'Loop Route': '26898',
    'Apartmentland Express': '25000',
    'Silver Route': '25489',
    'Paradise Route': '25003',
    'Wheat Route': '25213',
    'Lentil Route': '26899',
};

const loadShapeForRoute = async (routeName) => {
    try {
        const [asset] = await Asset.loadAsync(require('./assets/shapes.txt'));
        const uri = asset.localUri || asset.uri;
        const text = await FileSystem.readAsStringAsync(uri);
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

        const shapeId = routeToShapeId[routeName];
        if (!shapeId) return [];

        return parsed.data
            .filter(row => row.shape_id === shapeId)
            .sort((a, b) => Number(a.shape_pt_sequence) - Number(b.shape_pt_sequence))
            .map(row => ({
                latitude: parseFloat(row.shape_pt_lat),
                longitude: parseFloat(row.shape_pt_lon),
            }));
    } catch (err) {
        console.error("Error loading shape data:", err);
        return [];
    }
};

const HomeScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null); // for User's location beacon
    const [menuVisible, setMenuVisible] = useState(false); // state object for menu visibility
    const [busLocations, setBusLocations] = useState([]);  // array of objects holding real-time bus location data
    const [showBuses, setShowBuses] = useState(false);     // used to toggle display of live buses
    const [routeDialogVisible, displayRouteMenuPopup] = useState(false); // dictates whether the routes popup is visible or not
    const [selectedRoute, setSelectedRoute] = useState(null); // used to filter the map display by bus route
    const [favoriteRoutes, setFavoriteRoutes] = useState([]); // tracks user-favorited routes
    const [destination, setDestination] = useState(''); //stores destination user types in
    const [inputFocused, setInputFocused] = useState(false); // Track if TextInput is focused
    const [routePolyline, setRoutePolyline] = useState([]); // stores the shape data to render

    const mapRef = useRef(null); // reference to MapView instance for zooming actions

    // Prompts the user to turn on location services upon opening the app
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();

        // Load favorites from storage
        (async () => {
            const storedFavorites = await AsyncStorage.getItem('favoriteRoutes');
            if (storedFavorites) {
                setFavoriteRoutes(JSON.parse(storedFavorites));
            }
        })();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('favoriteRoutes', JSON.stringify(favoriteRoutes));
    }, [favoriteRoutes]);

    // Zooms to the user's location which is attained using the Google Maps API
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

    // Function invoked when a user selects a bus route from the Bus Routes list menu
    const filterBusRoutes = async (routeNumber) => {
        const selected = busRouteNames.find(r => r.number === routeNumber);
        setSelectedRoute(routeNumber);
        setBusLocations(prev =>
            prev.filter(bus => bus.routeNumber === routeNumber)
        );
        displayRouteMenuPopup(false);

        const shape = await loadShapeForRoute(selected.name);
        setRoutePolyline(shape);
    };

    // Toggles a bus route as favorite or unfavorite when the star icon is clicked
    const toggleFavorite = (routeNumber) => {
        setFavoriteRoutes(prev =>
            prev.includes(routeNumber)
                ? prev.filter(r => r !== routeNumber)
                : [...prev, routeNumber]
        );
    };

    // Sort bus routes to display favorites at the top of the list
    const sortedRoutes = [...busRouteNames].sort((a, b) => {
        const aFav = favoriteRoutes.includes(a.number);
        const bFav = favoriteRoutes.includes(b.number);
        return aFav === bFav ? a.number - b.number : bFav - aFav;
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider>
        <View style={styles.container}>
            {/* MapView */}
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
                    <Marker
                        key={bus.id}
                        coordinate={{
                            latitude: bus.position.latitude,
                            longitude: bus.position.longitude,
                        }}
                        title={`Bus ${bus.id}`}
                    />
                ))}
            </MapView>

            {/* Conditional Overlay */}
            {inputFocused && (
                <View style={styles.overlay}>
                    <Text style={styles.title}>Search Results:</Text>
                    <IconButton
                        icon="close"
                        size={30}
                        iconColor="white"
                        onPress={() => {
                            Keyboard.dismiss();
                            setInputFocused(false);
                            setDestination('');
                        }}
                        style={styles.closeButton}
                    />
                </View>
            )}

            {/* Destination Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={inputFocused ? styles.expandedInput : styles.input}
                    placeholder="Where To?"
                    placeholderTextColor="white"
                    value={destination}
                    onChangeText={(text) => setDestination(text)}
                    onFocus={() => setInputFocused(true)}
                />
            </View>

            {/* Menu */}
            {!inputFocused && (
                <View style={styles.menuContainer}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <Button
                                mode="contained"
                                onPress={() => setMenuVisible(true)}
                                style={{
                                    backgroundColor: menuVisible ? 'white' : 'black',
                                    marginTop: 15,
                                }}
                                labelStyle={{
                                    color: menuVisible ? 'black' : 'white',
                                }}
                            >
                                Menu
                            </Button>
                        }
                        contentStyle={{ backgroundColor: 'black' }}
                    >
                        <Menu.Item
                            onPress={zoomToUserLocation}
                            title="Zoom to My Location"
                            titleStyle={{ color: 'white' }}
                        />
                        <Divider />
                        <Menu.Item
                            onPress={zoomOnMap}
                            title="View Map"
                            titleStyle={{ color: 'white' }}
                        />
                        <Divider />
                        <Menu.Item
                            onPress={() => {
                                setMenuVisible(false);
                                displayRouteMenuPopup(true);
                            }}
                            title="View Bus Routes"
                            titleStyle={{ color: 'white' }}
                        />
                        <Divider />
                        <Menu.Item
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('Schedules');
                            }}
                            title="Schedules"
                            titleStyle={{ color: 'white' }}
                        />
                        <Divider />
                        <Menu.Item
                            onPress={() => {
                                setBusLocations([]);
                                toggleBusLocations(
                                    showBuses,
                                    setShowBuses,
                                    setBusLocations,
                                    setMenuVisible
                                );
                            }}
                            title={showBuses ? 'Hide All Buses' : 'Show All Buses'}
                            titleStyle={{ color: 'white' }}
                        />
                        <Divider />
                        <Menu.Item
                            onPress={() =>
                                navigation.navigate('Favorites', { favoriteRoutes })
                            }
                            title="Favorites"
                            titleStyle={{ color: 'white' }}
                        />
                    </Menu>
                </View>
            )}

            {/* Portal for Dialog */}
            <Portal>
                <Dialog
                    visible={routeDialogVisible}
                    onDismiss={() => displayRouteMenuPopup(false)}
                >
                    <Dialog.Title>Select a Route</Dialog.Title>
                    <Dialog.Content>
                        {sortedRoutes.map((route) => (
                            <View
                                key={route.number}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 4,
                                }}
                            >
                                <Button onPress={() => filterBusRoutes(route.number)}>
                                    {route.name}
                                </Button>
                                <IconButton
                                    icon={
                                        favoriteRoutes.includes(route.number)
                                            ? 'star'
                                            : 'star-outline'
                                    }
                                    size={20}
                                    iconColor={
                                        favoriteRoutes.includes(route.number) ? 'gold' : 'gray'
                                    }
                                    onPress={() => toggleFavorite(route.number)}
                                />
                            </View>
                        ))}
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    </Provider>
        </GestureHandlerRootView>
    );
};

const FavoritesScreen = ({ route }) => {
    const { favoriteRoutes } = route.params;
    const favorites = busRouteNames.filter(r => favoriteRoutes.includes(r.number));
    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text variant="titleLarge">Favorite Routes</Text>
            {favorites.length === 0 ? (
                <Text style={{ marginTop: 10 }}>No favorite routes selected.</Text>
            ) : (
                favorites.map(route => (
                    <Text key={route.number} style={{ marginTop: 10 }}>{route.name}</Text>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    menuContainer: {
        position: 'absolute',
        top: 20,
        right: 10,
    },
    inputContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, // Allows full usage of the screen for positioning
        alignItems: 'center',
    },
    input: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        elevation: 5,
        color: 'white',
        fontSize: 16,
        position: 'absolute',
        bottom: 50,
        left: '10%',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expandedInput: {
        position: 'absolute',
        top: 20,
        left: '5%',
        width: '80%',
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        elevation: 5,
        color: 'white',
        fontSize: 16,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        position: 'absolute',
        top: 100,
        left: '5%',
        color: 'white',
        fontSize: 18,

    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10, // Position the button at the top-right corner
        zIndex: 10,
    },
});

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pullman Transit Bus App' }} />
                <Stack.Screen name="Schedules" component={SchedulesScreen} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
