import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { StreamData } from '../types';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface Props {
    streamData: StreamData;
}

const TrainingGraph = ({ streamData }: Props) => {
    // Vérification des données
    if (
        !streamData ||
        !streamData.heartrate?.[0]?.data ||
        !streamData.time?.[0]?.data
    ) {
        return <div>Les données sont en cours de chargement...</div>;
    }

    const heartRateData = streamData.heartrate[0].data;
    const timeData = streamData.time[0].data;

    const interval = 20; // adapter selon la densité des données
    const downsample = <T,>(arr: T[]) =>
        arr.filter((_, index) => index % interval === 0);

    const chartData = {
        labels: downsample(timeData.map(t => (t / 60).toFixed(1))), // minutes
        datasets: [
            {
                label: 'Fréquence cardiaque (bpm)',
                data: downsample(heartRateData),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
                fill: false,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Temps (min)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'BPM',
                },
                beginAtZero: false,
            },
        },
    };

    return (
        <div>
            <div className="bg-white shadow-md rounded-xl p-4 mb-4 relative">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default TrainingGraph;
