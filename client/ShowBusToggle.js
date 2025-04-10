import { io } from "socket.io-client";

const socket = io("http://172.26.208.1:3000"); // Currently using my IP, need a way to have everyone connect

const toggleBusLocations = (showBuses, setShowBuses, setBusLocations, setMenuVisible) => {    
    if (showBuses) {
        setBusLocations([]); // Clear bus markers when toggled off
        socket.off("busUpdate"); // Stop listening for updates
    } else {
        socket.on("busUpdate", (buses) => {
            console.log("Received bus data:", buses);
            setBusLocations(buses);
          });
    }

    setShowBuses(!showBuses);
    setMenuVisible(false);
};

export default toggleBusLocations;