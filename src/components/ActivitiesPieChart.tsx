import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React from 'react';
import Loader from './Loader';
import { Props } from '../types/index'

ChartJS.register(ArcElement, Tooltip, Legend);

// Palette de couleurs pastel
const pastelColors = [
    '#A7D3F2', // bleu clair
    '#F7A8A8', // rouge clair
    '#B0EACD', // vert clair
    '#F9E2AE', // jaune clair
    '#D7B5F9', // violet clair
    '#FFD6E0', // rose pastel
    '#C6F6D5', // vert menthe
    '#FFF5BA', // jaune pâle
    '#C1E1C1', // vert doux
    '#FDC5F5', // rose lilas
];

const ActivitiesPieChart: React.FC<Props> = ({ activities }) => {
    const typeCount: { [key: string]: number } = {};

    activities.forEach(a => {
        typeCount[a.sport_type] = (typeCount[a.sport_type] || 0) + 1;
    });

    const labels = Object.keys(typeCount);
    const dataValues = Object.values(typeCount);

    // Associer des couleurs pastel aux activités
    const backgroundColors = labels.map((_, idx) => pastelColors[idx % pastelColors.length]);

    const data = {
        labels,
        datasets: [
            {
                label: 'Nombre d\'activités',
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: '#ffffff',
                borderWidth: 2,
                radius: '80%',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#000',
                    font: {
                        size: 14,
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.label}: ${context.raw}`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderWidth: 2,
            },
        }
    };

    return (
        <div>
            <div className="w-full bg-white rounded-lg p-4 mb-8">
                <h2 className="text-xl font-semibold mb-4">Répartition des Activités</h2>
                {!activities || activities.length === 0 ? (
                    <Loader />
                ) : (
                    <Pie data={data} options={options} />
                )}
            </div>
        </div>
    );
};

export default ActivitiesPieChart;
