import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MonthlyData, DistanceChartProps } from '../types/index';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const DistanceChart: React.FC<DistanceChartProps> = ({ activities }) => {
  const monthlyData: MonthlyData[] = Array.from({ length: 12 }, (_, i) => ({
    month: (i + 1).toString().padStart(2, "0"),
    distance: 0,
    elevation: 0,
    movingTime: 0,
    activityCount: 0,
  }));

  // Calcul des données mensuelles
  activities.forEach(a => {
    const date = new Date(a.start_date);
    const month = date.getMonth();
    monthlyData[month].distance += a.distance / 1000;
    monthlyData[month].elevation += a.total_elevation_gain;
    monthlyData[month].movingTime += a.moving_time / 3600;
    monthlyData[month].activityCount += 1;
  });

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Préparer les données du graphique
  const data = {
    labels: monthlyData.map((d) => monthNames[parseInt(d.month, 10) - 1]),
    datasets: [
      {
        label: "Distance",
        data: monthlyData.map((d) => d.distance),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4,
        yAxisID: "y-distance",
      },
      {
        label: "Dénivelé",
        data: monthlyData.map((d) => d.elevation),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.4,
        yAxisID: "y-elevation",
      },
      {
        label: "Temps",
        data: monthlyData.map((d) => d.movingTime),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        tension: 0.4,
        yAxisID: "y-movingTime",
      },
      {
        label: "Nombre d'activités",
        data: monthlyData.map((d) => d.activityCount),
        borderColor: "#f59e0b",
        backgroundColor: "#f59e0b",
        tension: 0.4,
        yAxisID: "y-activityCount",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx: any) => {
            const label = ctx.dataset.label || "";
            const raw = ctx.raw;

            if (label === "Temps") {
              const totalHours = raw as number;
              const hours = Math.floor(totalHours);
              const minutes = Math.round((totalHours - hours) * 60);
              return `${label}: ${hours}h${minutes < 10 ? "0" : ""}${minutes}`;
            }

            if (label === "Distance") {
              return `${label}: ${(raw as number).toFixed(1)} km`;
            }

            if (label === "Dénivelé") {
              return `${label}: ${(raw as number).toFixed(0)} m`;
            }

            return `${label}: ${raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mois",
        },
      },
      "y-elevation": {
        type: "linear" as const,
        position: "left" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Dénivelé (m)",
        },
      },
      "y-distance": {
        type: "linear" as const,
        position: "left" as const,
        offset: true,
        title: {
          display: true,
          text: "Distance (km)",
        },
      },
      "y-movingTime": {
        type: "linear" as const,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Temps (h)",
        },
      },
      "y-activityCount": {
        type: "linear" as const,
        position: "right" as const,
        offset: true,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Nombre d'activités",
        },
      },
    },
  };

  return (
    <div className="w-full mt-8">
      <Line data={data} options={options} height={90} />
    </div>
  );
};

export default DistanceChart;
