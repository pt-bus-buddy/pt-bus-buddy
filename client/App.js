import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Alert, Linking } from 'react-native';
import { Menu, Divider, Button, Provider, Dialog, Portal, Text, IconButton } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SchedulesScreen from './SchedulesScreen';
import toggleBusLocations from './ShowBusToggle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Papa from 'papaparse';

const Stack = createStackNavigator();

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

// TODO: Replace this with dynamic mapping later using trips.txt
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

async function loadShapeForRoute(routeName) {
    try {
        const asset = Asset.fromModule(require('./assets/shapes.txt'));
        await asset.downloadAsync();
        const fileUri = asset.localUri || asset.uri;
        const fileContents = await FileSystem.readAsStringAsync(fileUri);

        const parsed = Papa.parse(fileContents, {
            header: true,
            skipEmptyLines: true,
        });

        const targetShapeId = routeToShapeId[routeName];
        if (!targetShapeId) return [];

        return parsed.data
            .filter(row => row.shape_id === targetShapeId)
            .sort((a, b) => Number(a.shape_pt_sequence) - Number(b.shape_pt_sequence))
            .map(row => ({
                latitude: parseFloat(row.shape_pt_lat),
                longitude: parseFloat(row.shape_pt_lon),
            }));
    } catch (err) {
        console.error("Error loading shape data:", err);
        return [];
    }
}

const HomeScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [busLocations, setBusLocations] = useState([]);
    const [showBuses, setShowBuses] = useState(false);
    const [routeDialogVisible, displayRouteMenuPopup] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [favoriteRoutes, setFavoriteRoutes] = useState([]);
    const [routePolyline, setRoutePolyline] = useState([]);

    const mapRef = useRef(null);

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

    const filterBusRoutes = async (routeNumber) => {
        const selected = busRouteNames.find(r => r.number === routeNumber);
        setSelectedRoute(routeNumber);
        setBusLocations(prev => prev.filter(bus => bus.routeNumber === routeNumber));
        displayRouteMenuPopup(false);

        const shape = await loadShapeForRoute(selected.name);
        setRoutePolyline(shape);
    };

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

    const toggleFavorite = (routeNumber) => {
        setFavoriteRoutes(prev =>
            prev.includes(routeNumber)
                ? prev.filter(r => r !== routeNumber)
                : [...prev, routeNumber]
        );
    };

    const sortedRoutes = [...busRouteNames].sort((a, b) => {
        const aFav = favoriteRoutes.includes(a.number);
        const bFav = favoriteRoutes.includes(b.number);
        return aFav === bFav ? a.number - b.number : bFav - aFav;
    });

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
                            <Marker
                                key={bus.id}
                                coordinate={{
                                    latitude: bus.position.latitude,
                                    longitude: bus.position.longitude
                                }}
                                title={`Bus ${bus.id}`}
                            />
                        ))}
                        {routePolyline.length > 0 && (
                            <Polyline
                                coordinates={routePolyline}
                                strokeColor="blue"
                                strokeWidth={4}
                            />
                        )}
                    </MapView>

                    <View style={styles.menuContainer}>
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <Button
                                    mode="contained"
                                    onPress={() => setMenuVisible(true)}
                                    style={{ backgroundColor: menuVisible ? 'white' : 'black', marginTop: 15 }}
                                    labelStyle={{ color: menuVisible ? 'black' : 'white' }}
                                >
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
                            <Menu.Item onPress={() => {
                                setBusLocations([]);
                                toggleBusLocations(showBuses, setShowBuses, setBusLocations, setMenuVisible);
                            }} title={showBuses ? "Hide All Buses" : "Show All Buses"} titleStyle={{ color: 'white' }} />
                            <Divider />
                            <Menu.Item onPress={() => navigation.navigate('Favorites', { favoriteRoutes })} title="Favorites" titleStyle={{ color: 'white' }} />
                        </Menu>
                    </View>

                    <Portal>
                        <Dialog visible={routeDialogVisible} onDismiss={() => displayRouteMenuPopup(false)}>
                            <Dialog.Title>Select a Route</Dialog.Title>
                            <Dialog.Content>
                                {sortedRoutes.map(route => (
                                    <View key={route.number} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                                        <Button onPress={() => filterBusRoutes(route.number)}>{route.name}</Button>
                                        <IconButton
                                            icon={favoriteRoutes.includes(route.number) ? 'star' : 'star-outline'}
                                            size={20}
                                            iconColor={favoriteRoutes.includes(route.number) ? 'gold' : 'gray'}
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
