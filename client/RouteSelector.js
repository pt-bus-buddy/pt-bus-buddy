import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Dialog, Button, useTheme } from 'react-native-paper';

const RouteSelector = ({ visible, onDismiss, busRouteNames, onRouteSelect, selectedRoute }) => {
    const theme = useTheme();

    return (
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>Select a Bus Route</Dialog.Title>
            <Dialog.ScrollArea>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                    {busRouteNames.map((route) => (
                        <Button
                            key={route.number}
                            mode={selectedRoute === route.number ? "contained" : "outlined"}
                            style={[
                                styles.routeButton,
                                selectedRoute === route.number && styles.selectedRouteButton
                            ]}
                            labelStyle={{
                                color: 'black'
                            }}
                            onPress={() => onRouteSelect(route.number)}
                        >
                            {route.name}
                        </Button>
                    ))}
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button
                    onPress={() => {
                        onRouteSelect(null);
                    }}
                    labelStyle={{ color: 'black' }}
                >
                    Clear
                </Button>
                <Button
                    labelStyle={{ color: 'black' }}
                    onPress={onDismiss}
                >
                    Close
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    routeButton: {
        marginVertical: 6,
    },
    selectedRouteButton: {
        backgroundColor: '#DC143C',
    },
});

export default RouteSelector;