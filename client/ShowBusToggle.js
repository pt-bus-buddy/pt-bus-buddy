const toggleBusLocations = (showBuses, setShowBuses, setBusLocations, setMenuVisible) => {
    if (showBuses) {
        setBusLocations([]); // Clear bus markers
    } else {
        const buses = [
            { id: 1, latitude: 46.731, longitude: -117.178 },
            { id: 2, latitude: 46.728, longitude: -117.165 },
            { id: 3, latitude: 46.735, longitude: -117.172 },
        ];
        setBusLocations(buses); // Add bus markers
    }
    setShowBuses(!showBuses);
    setMenuVisible(false);
};

export default toggleBusLocations;
