import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { Activity, ActivityDetailData } from "../types";
import { fetchActivityStreams } from "../services/apiServices";

interface ActivityMapSummaryProps {
    detailData: ActivityDetailData;
    activity: Activity;
    allowedTypes: string[];
}

const ActivityMapSummary = ({ detailData, activity, allowedTypes }: ActivityMapSummaryProps) => {
    
    if (!allowedTypes.includes(activity.sport_type)) return null;

    const decodedPolyline = activity.map?.summary_polyline ? polyline.decode(activity.map.summary_polyline) : [];

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
                    <div className="text-lg font-semibold">{detailData.location || 'Chargement...'}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Météo</div>
                    <div className="text-lg font-semibold">
                        {detailData.weather ? `${detailData.weather.temperature.toFixed(1)}°C` : 'Chargement...'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityMapSummary;
