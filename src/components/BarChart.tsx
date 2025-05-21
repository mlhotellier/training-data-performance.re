import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { Activity, StreamData } from "../types/index";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Loader from "./Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarCharts = () => {
    const { id } = useParams<{ id: string }>();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [streamData, setStreamData] = useState<StreamData | null>(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const storedActivities = sessionStorage.getItem('activities');
        if (storedActivities) {
            const activities: Activity[] = JSON.parse(storedActivities);
            const found = activities.find(act => act.activityId === Number(id)) || null;
            setActivity(found);
        }
    }, [id]);

    useEffect(() => {
        const fetchStreams = async () => {
            const cached = sessionStorage.getItem(`activityDetails-${id}`);
            if (cached) {
                setStreamData(JSON.parse(cached));
                setLoading(false);
            } else if (token) {
                try {
                    const res = await fetch(`http://localhost:5000/api/activities/${id}/streams`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (!res.ok) throw new Error("Erreur de récupération des streams");
                    const data = await res.json();
                    setStreamData(data);
                    sessionStorage.setItem(`activityDetails-${id}`, JSON.stringify(data));
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStreams();
    }, [id, token]);

    const chartData = useMemo(() => {
        if (!streamData) return null;

        const distances = streamData.distance?.[0]?.data.map(d => d / 1000) || []; // en km
        const velocities = streamData.velocity_smooth?.[0]?.data || [];

        const timesPerSegment: number[] = [];
        const labels: string[] = [];
        let lastKm = 0;
        let accumulatedTime = 0;
        let accumulatedDistance = 0;

        for (let i = 0; i < distances.length; i++) {
            const deltaDistance = (i > 0) ? (distances[i] - distances[i - 1]) : distances[i];
            const speed = velocities[i];

            if (speed > 0 && deltaDistance > 0) {
                accumulatedTime += (deltaDistance * 1000) / (speed * 60); // minutes
                accumulatedDistance += deltaDistance;
            }

            if (Math.floor(distances[i]) > lastKm) {
                const pace = accumulatedDistance > 0 ? accumulatedTime / accumulatedDistance : 0; // min/km
                const timeBar = 100 - pace * 2
                timesPerSegment.push(parseFloat(timeBar.toFixed(2)));
                labels.push(`km ${lastKm + 1}`);
                accumulatedTime = 0;
                accumulatedDistance = 0;
                lastKm++;
            }
        }

        // Segment final partiel
        const remainingDistance = distances[distances.length - 1] - lastKm;
        if (accumulatedDistance > 0 && remainingDistance > 0) {
            const pace = accumulatedTime / accumulatedDistance; // min/km
            const timeBar = 100 - pace * 2
            timesPerSegment.push(parseFloat(timeBar.toFixed(2)));
            labels.push(`${(remainingDistance * 1000).toFixed(0)}m`);
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: "Temps moyen (min/km)",
                    data: timesPerSegment,
                    backgroundColor: "orange",
                    borderColor: "orange",
                    borderWidth: 1,
                },

            ],
        };
    }, [streamData]);

    const options: ChartOptions<'bar'> = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const timeBar = context.raw as number;
                        const pace = (100 - timeBar) / 2;

                        const minutes = Math.floor(pace);
                        const seconds = Math.round((pace - minutes) * 60);

                        const formattedPace = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        return `Allure: ${formattedPace} /km`;
                    },
                },
            },
            legend: {
                display: false,
            },

        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Temps (min/km)",
                },
                beginAtZero: false,
                ticks: {
                    callback: function (value) {
                        const timeBar = value as number;
                        const pace = (100 - timeBar) / 2;

                        const minutes = Math.floor(pace);
                        const seconds = Math.round((pace - minutes) * 60);

                        const formattedPace = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        return `${formattedPace}/km`;
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Kilomètres",
                },
            },
        },
    };

    const averagePace = useMemo(() => {
        if (!activity || !activity.distance || !activity.moving_time) return null;
        const pace = (activity.moving_time / 60) / (activity.distance / 1000); // min/km
        const minutes = Math.floor(pace);
        const seconds = Math.round((pace - minutes) * 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, [activity]);

    if (loading || !chartData) return <Loader />;

    return (
        <div>
            <div className="bg-white shadow-md rounded-2xl p-4 mb-4 relative">
                <h2 className="text-xl font-semibold mb-4">Temps moyen par kilomètre</h2>
                <div className="mb-4 text-gray-600 absolute top-4 right-4 flex items-center justify-center space-x-1 bg-zinc-100 rounded-xl p-2">
                    <p className="text-xs text-center">Moy.</p>
                    <p>{averagePace ? `${averagePace} /km` : "N/A"}</p>
                </div>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default BarCharts;
