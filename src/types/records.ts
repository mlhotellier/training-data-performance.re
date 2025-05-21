export type FastestKm = {
    distance: number,
    time: number,
    activityId: string,
};

export type FastestKmBlockProps = {
  records: FastestKm[];
};
