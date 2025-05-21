import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { StreamData } from "../types/index";

ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps = {
    streamData: StreamData | null;
};

const convertPointsToSeconds = (points: number, intervalSeconds: number) => {
    return points * intervalSeconds; // Convertir en secondes
};

const DoughnutChart = ({ streamData }: DoughnutChartProps) => {
    const maxHeartRate = 191;

    const chartData = useMemo(() => {
        if (!streamData || !streamData.heartrate?.[0]?.data.length) return null;

        const zones = [0, 0, 0, 0, 0, 0]; // Zones 1 à 6
        const intervalSeconds = streamData.heartrate?.[0]?.original_size
            ? streamData.heartrate?.[0]?.original_size / streamData.heartrate?.[0]?.data.length
            : 1; // Interval entre les points, sinon 1s par défaut

        // Comptage des points dans chaque zone
        for (const bpm of streamData.heartrate?.[0]?.data) {
            const percent = (bpm / maxHeartRate) * 100;

            if (percent < 72) zones[0]++;
            else if (percent < 82) zones[1]++;
            else if (percent < 87) zones[2]++;
            else if (percent < 92) zones[3]++;
            else if (percent < 97) zones[4]++;
            else zones[5]++;
        }

        // Conversion des points en secondes
        const timeInSeconds = zones.map((points) => convertPointsToSeconds(points, intervalSeconds));
        const totalTime = timeInSeconds.reduce((total, time) => total + time, 0); // Total du temps en secondes

        // Calcul du pourcentage du temps passé dans chaque zone
        const percentageInZones = timeInSeconds.map((time) => (time / totalTime) * 100);

        return {
            labels: [
                "Zone 1 (moins de 72%)",
                "Zone 2 (72-82%)",
                "Zone 3 (82-87%)",
                "Zone 4 (87-92%)",
                "Zone 5 (92-97%)",
                "Zone 6 (97-100%+)",
            ],
            datasets: [
                {
                    label: "Temps dans chaque zone (%)",
                    // Utiliser les pourcentages pour le graphique
                    data: percentageInZones,  // Les données en pourcentage pour calculer la taille du graphique
                    backgroundColor: [
                        "rgba(135,206,250, 0.6)", // Bleu clair
                        "rgba(60,179,113, 0.6)",  // Vert
                        "rgba(255,206,86, 0.6)",   // Jaune
                        "rgba(255,99,132, 0.6)",   // Rouge clair
                        "rgba(255,0,0, 0.7)",      // Rouge vif
                        "rgba(138,43,226, 0.6)",   // Violet pour zone 6
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [streamData, maxHeartRate]);

    const options = {
        cutout: "65%", // Réduit la taille du donut au centre
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    boxWidth: 20,
                    padding: 15,
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const percentage = tooltipItem.raw as number;
                        return ` ${percentage.toFixed(0)}%`; // Affiche le pourcentage formaté
                    },
                },
            },
        },
        maintainAspectRatio: false,
    };

    const averageHeartRate = useMemo(() => {
        if (!streamData?.heartrate?.[0]?.data.length) return null;
        const sum = streamData.heartrate?.[0]?.data.reduce((acc, val) => acc + val, 0);
        return Math.round(sum / streamData.heartrate?.[0]?.data.length);
    }, [streamData]);

    if (!chartData) return <p>Données cardio non disponibles</p>;

    return (
        <div className="bg-white shadow-md rounded-xl p-4 mb-4 relative">
            <h2 className="text-xl font-semibold mb-4">Répartition par zones cardio</h2>
            <div className="mb-4 text-gray-600 absolute top-4 right-4 flex items-center justify-center space-x-1 bg-zinc-100 rounded-xl p-2">
                <p className="text-xs text-center">Moy.</p>
                <p>{averageHeartRate ? `${averageHeartRate} bpm` : "N/A"}</p>
            </div>
            <div className="relative h-80 mx-auto">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

export default DoughnutChart;
