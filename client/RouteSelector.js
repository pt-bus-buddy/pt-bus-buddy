import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Dialog, Button } from 'react-native-paper';

const RouteSelector = ({
    visible,
    onDismiss,
    busRouteNames,
    selectedRoute,
    onSelectRoute
}) => {
    return (
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>Select a Bus Route</Dialog.Title>
            <Dialog.ScrollArea>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {busRouteNames.map((route) => (
                        <Button
                            key={route.number}
                            mode="outlined"
                            style={[
                                styles.routeButton,
                                selectedRoute === route.number && styles.selectedRouteButton,
                            ]}
                            labelStyle={[
                                styles.routeButtonLabel,
                                selectedRoute === route.number && styles.selectedRouteLabel,
                            ]}
                            onPress={() => onSelectRoute(route.number)}
                        >
                            {route.name}
                        </Button>
                    ))}
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button onPress={onDismiss} style={styles.closeButton}>
                    Close
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    routeButton: {
        marginVertical: 6,
        borderRadius: 5,
    },
    selectedRouteButton: {
        backgroundColor: 'blue',
    },
    routeButtonLabel: {
        color: 'black',
    },
    selectedRouteLabel: {
        color: 'white',
    },
    closeButton: {
        color: 'black',
    },
});

export default RouteSelector;