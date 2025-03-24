import { io } from "socket.io-client";

const socket = io("http://192.168.254.15:3000"); // Replace with your server's IP

const toggleBusLocations = (showBuses, setShowBuses, setBusLocations, setMenuVisible) => {    
    if (showBuses) {
        setBusLocations([]); // Clear bus markers when toggled off
        socket.off("busUpdate"); // Stop listening for updates
    } else {
        socket.on("busUpdate", (buses) => {
            console.log("Received bus data:", buses);
            setBusLocations([...buses]);
          });
    }

    setShowBuses(!showBuses);
    setMenuVisible(false);
};

export default toggleBusLocations;
