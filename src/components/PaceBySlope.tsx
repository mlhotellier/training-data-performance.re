import { StreamData } from "../types";

interface Props {
    streamData: StreamData;
}

type SegmentType = "montée" | "plat" | "descente";

interface SegmentStats {
    type: SegmentType;
    distance: number;
    duration: number;
}

// Fonction pour calculer la pente en %, sécurisée contre divisions nulles ou valeurs aberrantes
const computeSlope = (elev: number, dist: number): number => {
    if (dist === 0) return 0;
    return (elev / dist) * 100;
};

const computeSegmentStats = (
    distance: number[],
    altitude: number[],
    time: number[]
): SegmentStats[] => {
    const stats: Record<SegmentType, { distance: number; duration: number }> = {
        montée: { distance: 0, duration: 0 },
        plat: { distance: 0, duration: 0 },
        descente: { distance: 0, duration: 0 },
    };

    for (let i = 0; i < distance.length - 1; i++) {
        const dist = distance[i + 1] - distance[i];
        const elev = altitude[i + 1] - altitude[i];
        const duration = time[i + 1] - time[i];

        // Ignorer les données incohérentes
        if (dist <= 1 || duration <= 0) continue;

        const slope = computeSlope(elev, dist);

        let type: SegmentType;
        if (slope > 3) type = "montée";
        else if (slope < -3) type = "descente";
        else type = "plat";

        stats[type].distance += dist;
        stats[type].duration += duration;
    }

    return Object.entries(stats).map(([type, { distance, duration }]) => ({
        type: type as SegmentType,
        distance,
        duration,
    }));
};

const reconstructTime = (distance: number[], velocity: number[]): number[] => {
    const time: number[] = [0]; // point de départ à t = 0

    for (let i = 1; i < distance.length; i++) {
        const distDelta = distance[i] - distance[i - 1];
        const speed = velocity[i] || velocity[i - 1] || 1; // fallback pour éviter division par zéro
        const timeDelta = distDelta / speed;
        time.push(time[i - 1] + timeDelta);
    }

    return time;
};

const formatPace = (paceMinPerKm: number) => {
    const min = Math.floor(paceMinPerKm);
    const sec = Math.round((paceMinPerKm - min) * 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec} /km`;
};

const PaceBySlope = ({ streamData }: Props) => {
    const distance = streamData.distance?.[0]?.data ?? [];
    const altitude = streamData.altitude?.[0]?.data ?? [];
    let time = streamData.time?.[0]?.data ?? [];

    if (time.length === 0 && streamData.velocity_smooth?.[0]?.data) {
        time = reconstructTime(distance, streamData.velocity_smooth[0].data);
    }

    if (distance.length === 0 || altitude.length === 0 || time.length === 0) {
        return (
            <p className="text-red-600">
                Données incomplètes pour afficher l’analyse.
            </p>
        );
    }

    const data = computeSegmentStats(distance, altitude, time);

    return (
        <div className="bg-white shadow-md rounded-2xl p-8 mb-4">
            <h2 className="text-xl font-semibold">Allure par pente</h2>
            {data.map(({ type, distance, duration }) => {
                const paceMinPerKm = (duration / (distance / 1000)) / 60;
                return (
                    <div key={type}>
                        <h3 className="text-lg font-bold capitalize">{type}</h3>
                        <p>Distance : {(distance / 1000).toFixed(2)} km</p>
                        <p>Allure : {formatPace(paceMinPerKm)}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default PaceBySlope;
