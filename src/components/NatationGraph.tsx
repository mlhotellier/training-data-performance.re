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
import { NatationGraphProps } from '../types/index';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const NatationGraph: React.FC<NatationGraphProps> = ({ streamData }) => {


    if (!streamData || !streamData.distance || !streamData.heartrate || !streamData.velocity_smooth) {
        return <div>Les données sont en cours de chargement...</div>;
    }

    const { heartrate, velocity_smooth } = streamData;

    // Construction des tableaux pour le graphique
    const paceData = velocity_smooth?.data.map(v => v > 0 ? (100 / v / 60).toFixed(2) : null) || [];
    const heartRateData = heartrate?.data || [];
    const dataLength = heartrate?.data.length || 0;
    const timeLabels = Array.from({ length: dataLength }, (_, i) => i);

    const interval = 100;

    const downsampleData = (data: (number | string | null)[]) => {
        return data.filter((_, index) => index % interval === 0);
    };

    const downsampledPaceData = downsampleData(paceData);
    const downsampledHeartRateData = downsampleData(heartRateData);
    const downsampledTimeLabels = timeLabels.filter((_, index) => index % interval === 0);

    const chartData = {
        labels: downsampledTimeLabels,
        datasets: [
            {
                label: 'Allure (mn/100m)',  // <-- correction ici
                data: downsampledPaceData,
                borderColor: 'rgba(75, 192, 192, 1)',
                yAxisID: 'y',
                fill: false,
            },
            {
                label: 'Fréquence cardiaque (bpm)',
                data: downsampledHeartRateData,
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1',
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Données Natation : Allure & Fréquence cardiaque',
            },
        },
        scales: {
            y: {
                type: 'linear' as const,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Allure (mn/100m)',
                },
                reverse: true,
            },
            y1: {
                type: 'linear' as const,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: 'Fréquence cardiaque (bpm)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: '',
                },
            },
        },
    };


    return (
        <div className="bg-white shadow-md rounded-xl p-4 mb-4 relative">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default NatationGraph;