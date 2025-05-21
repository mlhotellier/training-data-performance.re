import React from "react";
import { Link } from "react-router-dom";
import { Activity } from "../types/index"
import { sportColors } from "../constants/sportColors";


const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {

  const sportColor = sportColors[activity.sport_type] || sportColors.default;

  const calculateSpeed = (distance: number, movingTime: number) => {
    if (movingTime === 0) return 0;
    return (distance / 1000) / (movingTime / 3600); // km/h
  };

  const calculatePace = (distance: number, movingTime: number) => {
    if (distance === 0) return 0;
    return (movingTime / 60) / (distance / 1000); // min/km
  };

  const speed = calculateSpeed(activity.distance, activity.moving_time);
  const pace = calculatePace(activity.distance, activity.moving_time);

  return (
    <Link to={`/activity/${activity.activityId}`}>
      <div className="group p-4 rounded-lg shadow mb-4 bg-zinc-100 hover:bg-zinc-200 cursor-pointer relative">
        <div className={`absolute right-0 bottom-0 w-2 rounded-br-md group-hover:rounded-tr-md h-4 group-hover:h-full transition-all duration-300 ${sportColor}`} />
        <p className="text-gray-600">
          <strong>{activity.sport_type}</strong> - {new Date(activity.start_date).toLocaleDateString()} - {activity.name}
        </p>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          {["Run", "TrailRun", "Bike", "Swim", "Hike", "Walk"].includes(activity.sport_type) && (
            <p><strong>Distance:</strong> {(activity.distance / 1000).toFixed(1)} km</p>)}
          {["Run", "TrailRun", "Bike", "Hike", "Walk"].includes(activity.sport_type) && (
            <p><strong>Dénivelé:</strong> {activity.total_elevation_gain} m</p>
          )}
          <p className="bg-"><strong>Temps :</strong>{" "}{(activity.sport_type === "Racquetball" ? activity.elapsed_time / 60 : activity.moving_time / 60).toFixed(0)}{" "}mn</p>
          {["Run", "TrailRun", "Bike", "Hike", "Swim", "Walk"].includes(activity.sport_type) && (<p><strong>Vitesse:</strong> {speed.toFixed(1)} km/h</p>)}
          {["Run", "TrailRun", "Bike", "Hike"].includes(activity.sport_type) && (<p><strong>Allure:</strong> {pace.toFixed(1)} min/km</p>)}
          <p><strong>FC Moyenne:</strong> {activity.average_heartrate ? `${activity.average_heartrate} bpm` : '—'}</p>
          <p><strong>FC Max:</strong> {activity.max_heartrate ? `${activity.max_heartrate} bpm` : '—'}</p>
        </div>
      </div>
    </Link >
  );
};

export default ActivityCard;