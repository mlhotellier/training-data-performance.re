import { Activity, GoalMetric, GoalType } from "../types";

export const getActivitiesByPeriod = (
    activities: Activity[],
    period: GoalType,
    echeance: string // <-- ajout ici
): Activity[] => {
    const endDate = new Date(echeance);

    return activities.filter((activity) => {
        const activityDate = new Date(activity.start_date);

        if (period === "week") {
            const day = endDate.getDay() === 0 ? 6 : endDate.getDay() - 1;
            const startOfWeek = new Date(endDate);
            startOfWeek.setDate(endDate.getDate() - day);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 7);

            return activityDate >= startOfWeek && activityDate < endOfWeek;
        } else {
            const startOfMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            const endOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1);

            return activityDate >= startOfMonth && activityDate < endOfMonth;
        }
    });
};

export const calculateTotal = (
    activities: Activity[],
    period: GoalType,
    metric: GoalMetric,
    echeance: string
): number => {
    const filtered = getActivitiesByPeriod(activities, period, echeance);
    switch (metric) {
        case "distance":
            return filtered.reduce((acc, a) => acc + a.distance, 0) / 1000;
        case "dénivelé":
            return filtered.reduce((acc, a) => acc + a.total_elevation_gain, 0);
        case "temps":
            return filtered.reduce((acc, a) => acc + a.moving_time, 0) / 3600;
        case "nombre d'activité":
            return filtered.length;
        default:
            return 0;
    }
};

export const formatDate = (date: string | number | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatReadableDate = (date: string | number | Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};
