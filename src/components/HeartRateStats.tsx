import React from "react";
import { Activity, HeartRateStatsProps } from "../types/index"
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import Loader from './Loader';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HeartRateStats: React.FC<HeartRateStatsProps> = ({ activities }) => {
    const validActivities = activities
        .filter(activity => activity.average_heartrate != null && activity.max_heartrate != null)
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    // Trouver l'activité avec la FC max
    const maxHeartRateActivity = validActivities.reduce((maxActivity, activity) => {
        return activity.max_heartrate > (maxActivity?.max_heartrate || 0) ? activity : maxActivity;
    }, null as Activity | null);

    // Calculer la FC moyenne
    const averageHeartRate = validActivities.length > 0
        ? validActivities.reduce((acc, activity) => acc + activity.average_heartrate, 0) / validActivities.length
        : 0;

    const maxHeartRate = maxHeartRateActivity ? maxHeartRateActivity.max_heartrate : 0;

    const chartData = {
        labels: validActivities.map((activity) => {
            const date = new Date(activity.start_date);
            return `${activity.name} | ${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
        }),
        datasets: [
            {
                label: "FC Moyenne",
                data: validActivities.map((activity) => activity.average_heartrate),
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.4,
            },
            {
                label: "FC Max",
                data: validActivities.map((activity) => activity.max_heartrate),
                borderColor: "rgba(255, 99, 132, 1)",
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                position: "bottom" as const,
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
                callbacks: {
                    title: (tooltipItems: any[]) => {
                        const index = tooltipItems[0].dataIndex;
                        const activity = validActivities[index];
                        const date = new Date(activity.start_date);
                        return `${activity.name} (${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()})`;
                    },
                    label: (tooltipItem: any) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw} bpm`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false,
                },
            },
            y: {
                beginAtZero: false,
                min: 70,
                title: {
                    display: true,
                    text: "Fréquence cardiaque (bpm)",
                },
            },
        },
    };

    return (
        <div className="col-span-2">
            <div className="w-full bg-white p-4 rounded-lg mb-8 relative">
                <h2 className="text-xl font-semibold mb-4">Fréquence Cardiaque</h2>
                {!activities || activities.length === 0 ? (
                    <Loader />
                ) : (
                    <>
                        <div className="w-full mt-8">
                            <Line data={chartData} options={options} height={110} />
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <div className="text-center rounded-md p-2 hover:bg-zinc-200">
                                <p className="text-2xl">{averageHeartRate > 0 ? averageHeartRate.toFixed(0) : "Données insuffisantes"}</p>
                                <h4 className="text-xs text-gray-600">FC Moyenne</h4>
                            </div>
                            <div className="text-center rounded-md p-2 hover:bg-zinc-200">
                                <p className="text-2xl">{maxHeartRate > 0 ? maxHeartRate : "Données insuffisantes"}</p>
                                <h4 className="text-xs text-gray-600">FC Max</h4>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HeartRateStats;
