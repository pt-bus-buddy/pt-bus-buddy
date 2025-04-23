import { io } from "socket.io-client";

const socket = io("http://192.168.83.231:3000"); // Replace with dynamic IP setup in production

const toggleBusLocations = (showBuses, setShowBuses, setBusLocations, setMenuVisible, selectedRoute) => {
    if (showBuses) {
        setBusLocations([]);
        socket.off("busUpdate");
    } else {
        socket.on("busUpdate", (buses) => {
            //console.log("Received bus data:", buses);
            //console.log("Selected route: ", selectedRoute);
            const filteredBuses = selectedRoute
                ? buses.filter(bus => bus.id === selectedRoute.toString())
                : buses;
            setBusLocations(filteredBuses);
            console.log("Showing: ", filteredBuses);
        });
    }

    setShowBuses(!showBuses);
    setMenuVisible(false);
};

export default toggleBusLocations;
