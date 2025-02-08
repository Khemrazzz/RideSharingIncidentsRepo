import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

const flagIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/en/d/db/Flag_of_Mauritius.svg",
  iconSize: [40, 25], // Increased size for visibility
  iconAnchor: [20, 12],
  popupAnchor: [0, -10]
});

const API_URL = 'https://localhost:44375/api/incidents';

interface Incident {
    id: number;
    location: string;
    incidentType: string;
    incidentDate: string;
    rideService: string;
    driverName: string;
    description: string;
    passengerName: string;
}

const MauritiusMap = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    console.log("Updated incidents:", incidents);
  }, [incidents]); // Debugging API response

  const fetchIncidents = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch incidents');
      const data: Incident[] = await response.json();
      console.log("Fetched incidents:", data); // Debug API response
      setIncidents(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  return (
    <MapContainer center={[-20.2, 57.5]} zoom={10} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {incidents.length > 0 ? (
        incidents.map((incident) => {
          if (!incident.location) return null;

          const coords = incident.location
            .split(",")
            .map(num => parseFloat(num.trim()))
            .filter(num => !isNaN(num));

          if (coords.length !== 2) {
            console.warn("Skipping invalid location:", incident.location);
            return null;
          }

          return (
            <Marker key={incident.id} position={coords as [number, number]} icon={flagIcon}>
              <Popup>
                <strong>{incident.incidentType}</strong><br />
                {incident.description}<br />
                Driver: {incident.driverName}<br />
                Passenger: {incident.passengerName}<br />
                Date: {new Date(incident.incidentDate).toLocaleDateString()}
              </Popup>
            </Marker>
          );
        })
      ) : (
        <p>No incidents to display</p>
      )}
    </MapContainer>
  );
};

export default MauritiusMap;