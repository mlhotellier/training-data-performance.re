import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { TrainingGraphProps } from '../types'

// Enregistrement des composants dans ChartJS
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);


const TrainingGraph: React.FC<TrainingGraphProps> = ({ streamData }) => {

    // Vérifier si streamData existe et contient les propriétés attendues
    if (!streamData || !streamData.heartrate || !streamData.time) {
        return <div>Les données sont en cours de chargement...</div>;
    }

    const { heartrate, time } = streamData;

    const heartRateData = heartrate.data || [];
    const dataLength = time.data.length || 0;
    const timeLabels = Array.from({ length: dataLength }, (_, i) => i);

    const interval = 100;

    const downsampleData = (data: (number | string | null)[]) => {
        return data.filter((_, index) => index % interval === 0);
    };

    const downsampledTimeLabels = timeLabels.filter((_, index) => index % interval === 0);
    const downsampledHeartRateData = downsampleData(heartRateData);

    // Préparer les données pour le graphique
    const chartData = {
        labels: downsampledTimeLabels,  // Utiliser la distance comme labels (axe X)
        datasets: [
            {
                label: 'Fréquence cardiaque (bpm)',
                data: downsampledHeartRateData,
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <div className="bg-white shadow-md rounded-xl p-4 mb-4 relative">
                <Line data={chartData} />
            </div>
        </div>
    );
};


export default TrainingGraph;