// src/components/ActivityChartSection.tsx
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
    ChartOptions,
    ChartData,
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { StreamData } from "../types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend);

interface Props {
    streamData: StreamData;
}

const MAX_POINTS = 150;

const downsample = <T,>(data: T[], adjustedInterval: number): T[] => {
    const result = data.filter((_, i) => i % adjustedInterval === 0);
    return result.slice(0, MAX_POINTS); // garantie max 200 points
};


const ActivityChartSection = ({ streamData }: Props) => {
    const adjustedInterval = useMemo(() => {
        const length = streamData?.distance?.[0]?.data.length || 1;

        return Math.max(1, Math.floor(length / MAX_POINTS));
    }, [streamData]);


    const chartData: ChartData<"line", (string | number | null)[], number> = useMemo(() => {
        const distanceData = streamData?.distance?.[0]?.data.map(d => (d / 1000).toFixed(2)) || [];
        const paceData = streamData?.velocity_smooth?.[0]?.data.map(v =>
            v > 0 ? +(1000 / (v * 60)).toFixed(2) : null
        ) || [];
        const altitudeData = streamData?.altitude?.[0]?.data || [];
        const heartRateData = streamData?.heartrate?.[0]?.data || [];
        const timeLabels = streamData?.distance?.[0]?.data.map((_, i) => i) || [];

        return {
            labels: downsample(timeLabels, adjustedInterval),
            datasets: [
                {
                    label: "Distance (km)",
                    data: downsample(distanceData, adjustedInterval),
                    borderColor: "orange",
                    tension: 0.4,
                    yAxisID: "yDistance",
                },
                {
                    label: "Allure (min/km)",
                    data: downsample(paceData, adjustedInterval),
                    borderColor: "blue",
                    tension: 0.4,
                    yAxisID: "yPace",
                    spanGaps: true,
                },
                {
                    label: "Altitude (m)",
                    data: downsample(altitudeData, adjustedInterval),
                    borderColor: "rgba(205,205,205,1)",
                    tension: 0.4,
                    yAxisID: "yAltitude",
                    fill: true,
                    backgroundColor: "rgba(210,210,210,0.25)",
                },
                {
                    label: "Fréquence cardiaque (bpm)",
                    data: downsample(heartRateData, adjustedInterval),
                    borderColor: "red",
                    tension: 0.4,
                    yAxisID: "yHeartRate",
                },
            ],
        };
    }, [streamData, adjustedInterval]);

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        plugins: { title: { display: false } },
        scales: {
            yDistance: {
                type: "linear",
                position: "left",
                title: { display: true, text: "Distance (km)" },
            },
            yPace: {
                type: "linear",
                position: "left",
                title: { display: true, text: "Allure (min/km)" },
                reverse: true,
            },
            yAltitude: {
                type: "linear",
                position: "right",
                title: { display: true, text: "Altitude (m)" },
                grid: { drawOnChartArea: false },
            },
            yHeartRate: {
                type: "linear",
                position: "right",
                title: { display: true, text: "FC (bpm)" },
                grid: { drawOnChartArea: false },
                offset: true,
            },
            x: {
                display: false,
            },
        },
    };

    return (
        <div className="bg-white shadow-md rounded-2xl p-8 mb-4">
            <Line data={chartData} options={chartOptions} height={85} />
        </div>
    );
};

export default ActivityChartSection;
