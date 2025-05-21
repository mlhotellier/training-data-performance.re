import React, { useEffect, useState } from "react";
import { Activity, GlobalStatsProps } from "../types/index";
import DistanceChart from "./DistanceChart";
import Loader from "./Loader";

const GlobalStats: React.FC<GlobalStatsProps> = ({ activities }) => {
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
    const [selectedType, setSelectedType] = useState<string | "All">("All");
    const currentYear = new Date().getFullYear().toString();
    const [selectedYear, setSelectedYear] = useState<string | "All">(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string | "All">('All');
    const activityTypes = Array.from(new Set(activities.map(a => a.sport_type)));
    const [page, setPage] = useState<number>(1);

    // ✅ Filtrage des activités
    useEffect(() => {
        let filtered = activities;

        if (selectedType !== "All") {
            filtered = filtered.filter(a => a.sport_type === selectedType);
        }

        if (selectedYear !== "All") {
            filtered = filtered.filter(a => new Date(a.start_date).getFullYear().toString() === selectedYear);
        }

        if (selectedMonth !== "All") {
            filtered = filtered.filter(a => new Date(a.start_date).getMonth() + 1 === parseInt(selectedMonth));
        }

        setFilteredActivities(filtered);
        setPage(1);
    }, [
        activities,
        selectedType,
        selectedYear,
        selectedMonth,
    ]);

    const totalDistance = filteredActivities.reduce((acc, a) => acc + a.distance, 0) / 1000;
    const totalElevation = filteredActivities.reduce((acc, a) => acc + a.total_elevation_gain, 0);
    const totalTime = filteredActivities.reduce((acc, a) => acc + a.moving_time, 0) / 3600;

    return (
        <div className=" bg-white rounded-lg p-4 mb-8 relative">
            <h2 className="text-xl font-semibold mb-4">Statistiques globales</h2>
            {!activities || activities.length === 0 ? (
                <Loader />
            ) : (
                <>
                    <div className="flex space-x-4 mb-4 absolute top-4 right-4">

                        <select
                            value={selectedType}
                            onChange={e => setSelectedType(e.target.value)}
                            className="p-2 rounded bg-white shadow"
                        >
                            <option value="All">Sport</option>
                            {activityTypes.map(sport => (
                                <option key={sport} value={sport}>{sport}</option>
                            ))}
                        </select>

                        <select
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                            className="p-2 rounded bg-white shadow"
                        >
                            <option value="All">Années</option>
                            {Array.from(new Set(activities.map(a => new Date(a.start_date).getFullYear())))
                                .map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                        </select>

                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="p-2 rounded bg-white shadow capitalize"
                        >
                            <option value="All">Mois</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={(i + 1).toString()}>
                                    {new Date(2025, i).toLocaleString('fr-FR', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <DistanceChart activities={filteredActivities} />
                    <div className="p-4 flex space-x-6">
                        <div className="text-center flex-1">
                            <h3 className="text-xl font-semibold">{totalDistance.toFixed(1)} km</h3>
                            <p className="text-sm text-gray-600">Distance Totale</p>
                        </div>
                        <div className="text-center flex-1">
                            <h3 className="text-xl font-semibold">{totalElevation.toFixed(0)} m</h3>
                            <p className="text-sm text-gray-600">D+ Cumulé</p>
                        </div>
                        <div className="text-center flex-1">
                            <h3 className="text-xl font-semibold">{totalTime.toFixed(1)} h</h3>
                            <p className="text-sm text-gray-600">Temps Total</p>
                        </div>
                        <div className="text-center flex-1">
                            <h3 className="text-xl font-semibold">{filteredActivities.length}</h3>
                            <p className="text-sm text-gray-600">Nombre d'Activités</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default GlobalStats;