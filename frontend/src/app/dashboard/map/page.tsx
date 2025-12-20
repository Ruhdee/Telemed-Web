"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Dynamic import for Leaflet component (which is not SSR friendly)
const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || "YOUR_TOMTOM_KEY_HERE";

export default function MapPage() {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [route, setRoute] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Get User Location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(loc);
                    fetchHospitals(loc[0], loc[1]);
                },
                (err) => {
                    console.error("Geolocation Error:", err);
                    setError("Could not get your location. Showing default area.");
                    // Fallback to a default location (e.g. Center of generic city)
                    const defaultLoc: [number, number] = [28.6139, 77.2090]; // Delhi
                    setUserLocation(defaultLoc);
                    fetchHospitals(defaultLoc[0], defaultLoc[1]);
                }
            );
        }
    }, []);

    // 2. Fetch Nearby Hospitals (TomTom Search)
    const fetchHospitals = async (lat: number, lon: number) => {
        setIsLoading(true);
        try {
            // Check if we have a real key, otherwise use mock data for demo
            if (TOMTOM_API_KEY === "YOUR_TOMTOM_KEY_HERE") {
                console.warn("Using Mock Data for Hospitals (No API Key provided)");
                // Mock ~10km radius hospitals
                setHospitals([
                    { poi: { name: "City General Hospital" }, address: { freeformAddress: "Downtown, Metro City" }, position: { lat: lat + 0.01, lon: lon + 0.01 }, dist: 1.5 },
                    { poi: { name: "Community Health Center" }, address: { freeformAddress: "Westside Avenue" }, position: { lat: lat - 0.02, lon: lon + 0.005 }, dist: 3.2 },
                    { poi: { name: "St. Mary's Medical" }, address: { freeformAddress: "North Hills" }, position: { lat: lat + 0.015, lon: lon - 0.02 }, dist: 5.0 },
                ]);
            } else {
                const response = await fetch(
                    `https://api.tomtom.com/search/2/search/hospital.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=10000`
                );
                const data = await response.json();
                setHospitals(data.results || []);
            }
        } catch (err) {
            console.error("Search API Error:", err);
            setError("Failed to load nearby hospitals.");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Calculate Route on Click
    const handleNavigate = async (destLat: number, destLon: number) => {
        if (!userLocation) return;

        // Mock routing if no key
        if (TOMTOM_API_KEY === "YOUR_TOMTOM_KEY_HERE") {
            // Draw a simple straight line for demo
            setRoute([userLocation, [destLat, destLon]]);
            return;
        }

        try {
            const response = await fetch(
                `https://api.tomtom.com/routing/1/calculateRoute/${userLocation[0]},${userLocation[1]}:${destLat},${destLon}/json?key=${TOMTOM_API_KEY}`
            );
            const data = await response.json();
            const points = data.routes[0].legs[0].points.map((p: any) => [p.latitude, p.longitude]);
            setRoute(points);
        } catch (err) {
            console.error("Routing Error:", err);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] relative glass-panel overflow-hidden p-0 rounded-2xl flex flex-col md:flex-row">
            {/* Sidebar List */}
            <div className="w-full md:w-1/3 bg-white/95 backdrop-blur-xl p-4 overflow-y-auto border-r border-[var(--gold-primary)]/20 z-10 custom-scrollbar">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="text-[var(--gold-primary)]" /> Nearby Hospitals
                </h2>

                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Scanning 10km radius...</div>
                ) : (
                    <div className="space-y-4 pb-20 md:pb-0">
                        {hospitals.map((h, i) => (
                            <div
                                key={i}
                                onClick={() => handleNavigate(h.position.lat, h.position.lon)}
                                className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer border border-transparent hover:border-[var(--gold-primary)] transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800">{h.poi.name}</h3>
                                    <span className="text-xs font-bold text-[var(--gold-dark)] bg-[var(--gold-light)]/20 px-2 py-1 rounded">
                                        {h.dist ? `${h.dist} km` : 'Near'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{h.address?.freeformAddress || "Address Unavailable"}</p>

                                <div className="flex gap-2">
                                    <Button variant="outline" className="h-8 text-xs flex-1 gap-1">
                                        <Navigation size={12} /> Route
                                    </Button>
                                    <Button variant="secondary" className="h-8 text-xs flex-1 gap-1">
                                        <Phone size={12} /> Call
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {hospitals.length === 0 && !error && (
                            <div className="text-center p-4 text-gray-500">No hospitals found nearby.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Map Area */}
            <div className="flex-1 bg-gray-50 relative z-0">
                <MapComponent
                    userLocation={userLocation}
                    hospitals={hospitals}
                    route={route}
                />
            </div>
        </div>
    );
}
