// components/ScheduleViewer.js
import { useState, useEffect } from "react";

function ScheduleViewer() {
    const [schedules, setSchedules] = useState([]);
    const [routeId, setRouteId] = useState("");
    const [stopId, setStopId] = useState("");

    useEffect(() => {
        if (routeId && stopId) {
            fetch(`/api/schedules?route_id=${routeId}&stop_id=${stopId}`)
                .then((res) => res.json())
                .then(setSchedules);
        }
    }, [routeId, stopId]);

    return (
        <div>
            <h2>Bus Schedules</h2>
            <label>Route: </label>
            <input type="text" value={routeId} onChange={(e) => setRouteId(e.target.value)} />
            <label>Stop: </label>
            <input type="text" value={stopId} onChange={(e) => setStopId(e.target.value)} />
            
            <table>
                <thead>
                    <tr>
                        <th>Arrival Time</th>
                        <th>Departure Time</th>
                        <th>Day</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map((s) => (
                        <tr key={s.id}>
                            <td>{s.arrival_time}</td>
                            <td>{s.departure_time}</td>
                            <td>{s.day_of_week}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ScheduleViewer;
