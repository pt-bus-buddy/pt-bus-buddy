import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Menu, Divider, Button, Provider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SchedulesScreen from './SchedulesScreen';
import toggleBusLocations from './ShowBusToggle';


const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [busLocations, setBusLocations] = useState([]);
    const [showBuses, setShowBuses] = useState(false);
    const mapRef = useRef(null);

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

    const viewBusRoutes = () => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
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
                <MapView ref={mapRef} style={styles.map} initialRegion={{
                    latitude: 46.7300, longitude: -117.1740, latitudeDelta: 0.065, longitudeDelta: 0.04,
                }} showsUserLocation={true}>
                    {userLocation && <Marker coordinate={userLocation} title="My Location" />}
                    {busLocations.map(bus => (
                        <Marker key={bus.id} coordinate={{ latitude: bus.latitude, longitude: bus.longitude }} title={`Bus ${bus.id}`} />
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
                        contentStyle={{ backgroundColor: 'black' }}>
                        <Menu.Item onPress={zoomToUserLocation} title="Zoom to My Location" titleStyle={{ color: 'white' }} />
                        <Divider />
                        <Menu.Item onPress={viewBusRoutes} title="View Map" titleStyle={{ color: 'white' }} />
                        <Divider />
                        <Menu.Item onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate('Schedules');
                        }} title="Schedules" titleStyle={{ color: 'white' }} />
                        <Divider />
                        <Menu.Item
                            onPress={() => {
                                // For some reasons, the markers only show up after the second time bus data is recieved from socket
                                // So have to set bus locations for first time or else there's a long delay
                                // Currently using test data, change to real-time data
                                setBusLocations([
                                    { id: "TestBus1", latitude: 46.731 + Math.random() * 0.01, longitude: -117.178 + Math.random() * 0.01 },
                                    { id: "TestBus2", latitude: 46.728 + Math.random() * 0.01, longitude: -117.165 + Math.random() * 0.01 },
                                    { id: "TestBus3", latitude: 46.735 + Math.random() * 0.01, longitude: -117.172 + Math.random() * 0.01 },
                                  ]);

                                toggleBusLocations(showBuses, setShowBuses, setBusLocations, setMenuVisible)
                            }}
                            
                            title={showBuses ? "Hide All Buses" : "Show All Buses"}
                            titleStyle={{ color: 'white' }}
                        />
                    </Menu>
                </View>
            </View>
        </Provider>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bus Tracker' }} />
                <Stack.Screen name="Schedules" component={SchedulesScreen} options={{ title: 'Schedules' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );

}

// Styles
const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    menuContainer: { position: 'absolute', top: 40, right: 20 },

});


