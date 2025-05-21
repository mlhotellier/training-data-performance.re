export interface Stream {
    original_size: number;
    data: number[];
    type: string;
}

export type StreamData = {
    altitude: Stream[];
    distance: Stream[];
    heartrate: Stream[];
    velocity_smooth: Stream[];
    [key: string]: Stream[];
};

export interface NatationGraphProps {
    streamData: StreamData;
}

export interface TrainingGraphProps {
    streamData: StreamData;
}
