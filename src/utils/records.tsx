import { FastestKm, StreamData } from "../types";

export function getFastestKmsFromStreams(streamData: StreamData, activityId: string): FastestKm[] {
    const distance = streamData?.distance?.data || [];

    if (distance.length === 0) {
        return [];
    }

    const results: FastestKm[] = [];

    const getFastestSegment = (segmentDistance: number): FastestKm | null => {
        let bestTime = Infinity;

        for (let start = 0; start < distance.length; start++) {
            const startDist = distance[start];
            const targetDist = startDist + segmentDistance;

            let end = start;
            while (end < distance.length && distance[end] < targetDist) {
                end++;
            }

            if (end >= distance.length) break;

            const time = end - start; // 1 point = 1s

            if (time < bestTime) {
                bestTime = time;
            }
        }

        return bestTime !== Infinity
            ? { distance: segmentDistance, time: bestTime, activityId }
            : null;
    };

    // Distances : 1 km, 5 km, 10 km, 21.1 km
    const distances = [1000, 5000, 10000, 21100];

    for (const d of distances) {
        const record = getFastestSegment(d);
        if (record) results.push(record);
    }

    return results;
}

export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);

    if (hours > 0) {
        return `${hours} h ${minutes} min ${secs} s`;
    } else if (minutes > 0) {
        return `${minutes} min ${secs} s`;
    } else {
        return `${secs} s`;
    }
}

