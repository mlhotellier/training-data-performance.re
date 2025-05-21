export interface Activity {
  activityId: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  sport_type: string;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  start_date_local?: string;
  average_heartrate: number;
  max_heartrate: number;
  map?: {
    id: string;
    summary_polyline?: string;
    resource_state?: number;
  };
}

export interface LatestActivityProps {
  activities: Activity[];
}

export type GlobalStatsProps = {
  activities: Activity[];
};

export interface DistanceChartProps {
  activities: Activity[];
}

export interface MonthlyData {
  month: string;
  distance: number; // en kilomètres
  elevation: number; // en mètres
  movingTime: number; // en heures
  activityCount: number; // nombre d'activités pour le mois
}

export interface HeartRateStatsProps {
  activities: Activity[];
}

export interface Props {
  activities: {
      sport_type: string;
  }[];
}