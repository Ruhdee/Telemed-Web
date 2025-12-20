"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect } from "react";
import L from "leaflet";

interface MapComponentProps {
    userLocation: [number, number] | null;
    hospitals: any[];
    route: any[];
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, 14);
    return null;
}

export default function MapComponent({ userLocation, hospitals, route }: MapComponentProps) {
    // Default to a central location (e.g. India center or generic) if no user location yet
    const center: [number, number] = userLocation || [20.5937, 78.9629];

    return (
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userLocation && (
                <>
                    <ChangeView center={userLocation} />
                    <Marker position={userLocation}>
                        <Popup>Your Location</Popup>
                    </Marker>
                </>
            )}

            {hospitals.map((hospital, index) => (
                <Marker
                    key={index}
                    position={[hospital.position.lat, hospital.position.lon]}
                >
                    <Popup>
                        <b>{hospital.poi.name}</b><br />
                        {hospital.address.freeformAddress}
                    </Popup>
                </Marker>
            ))}

            {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
    );
}
