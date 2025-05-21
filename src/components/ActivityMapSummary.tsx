import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { Activity } from "../types";
import { fetchLocation, fetchWeather } from "../services/apiServices";

interface ActivityMapSummaryProps {
    activity: Activity;
    allowedTypes: string[];
}

const ActivityMapSummary = ({ activity, allowedTypes }: ActivityMapSummaryProps) => {

    if (!allowedTypes.includes(activity.sport_type)) {
        return null;
    }

    const [location, setLocation] = useState<string | null>(null);
    const [weather, setWeather] = useState<{ description: string, temperature: number } | null>(null);
    const decodedPolyline = activity.map?.summary_polyline ? polyline.decode(activity.map.summary_polyline) : [];
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token || !activity?.start_latlng || !allowedTypes.includes(activity.sport_type)) return;
        const [lat, lon] = activity.start_latlng;
        
        fetchLocation(lat, lon, token).then(setLocation).catch(console.error);
    }, [activity]);

    // useEffect(() => {
    //     if (!token || !activity?.start_latlng || !activity?.start_date_local || !allowedTypes.includes(activity.sport_type)) return;

    //     const [lat, lon] = activity.start_latlng;
    //     const startDate = new Date(activity.start_date_local);
    //     const startHour = startDate.getUTCHours();
    //     const startMinute = startDate.getUTCMinutes();
    //     const dateStr = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;

    //     fetchWeather(lat, lon, dateStr, startHour, startMinute, token).then(setWeather).catch(console.error);
    // }, [activity]);

    return (
        <div id="map">
            <div className="h-[320px] rounded-t-2xl overflow-hidden">
                <MapContainer center={decodedPolyline[0]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {decodedPolyline.length > 0 && (
                        <Polyline positions={decodedPolyline} color="blue" weight={4} />
                    )}
                    {activity.start_latlng && (
                        <Marker position={activity.start_latlng}>
                            <Popup>Départ</Popup>
                        </Marker>
                    )}
                    {activity.end_latlng && (
                        <Marker position={activity.end_latlng}>
                            <Popup>Arrivée</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
            <div className="flex justify-around text-center bg-white shadow-md rounded-b-2xl p-4 mb-4">
                <div>
                    <div className="text-sm text-gray-500">Distance</div>
                    <div className="text-lg font-semibold">{(activity.distance / 1000).toFixed(2)} km</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Dénivelé +</div>
                    <div className="text-lg font-semibold">{Math.round(activity.total_elevation_gain)} m</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Lieu</div>
                    <div className="text-lg font-semibold">{location || 'Chargement...'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Météo</div>
                    <div className="text-lg font-semibold">
                        {weather ? `${weather.temperature.toFixed(1)}°C` : 'Chargement...'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityMapSummary;