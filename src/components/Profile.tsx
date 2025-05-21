import React from "react";
import Loader from "./Loader";
import { Activity, ProfileProps } from "../types/index";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    .replace(/^\w/, c => c.toUpperCase());
};

const Profile: React.FC<ProfileProps> = ({ profile, activities }) => {
  const totalDistance = activities.reduce((acc: number, a: Activity) => acc + a.distance, 0) / 1000;
  const totalElevation = activities.reduce((acc: number, a: Activity) => acc + a.total_elevation_gain, 0);
  const totalTime = activities.reduce((acc: number, a: Activity) => acc + a.moving_time, 0) / 3600;

  return (
    <div>
      <div className="w-full bg-white shadow-md rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-semibold mb-4">Mon profil</h2>
        {!profile || !activities || activities.length === 0 ? (
          < Loader />
        ) : (
          <div>
            <div className="flex mb-5">
              <img
                src={profile.profile_medium}
                alt="Profil"
                className="rounded-full w-20 h-20 mr-4"
              />
              <div className="text-left">
                <p className="text-xs text-gray-400 mb-3">
                  Membre depuis {formatDate(profile.created_at)}
                </p>
                <h2 className="text-xl font-bold">
                  {profile.firstname} {profile.lastname}
                </h2>
                <p className="text-sm text-gray-500">
                  {profile.city || "Ville non spécifiée"},{" "}
                  {profile.country || "Pays non spécifié"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center rounded-md pt-2 pb-2 bg-zinc-100 hover:bg-zinc-200">
                <p className="text-xs text-gray-600">Nombre d'Activités</p>
                <h3 className="text-xl font-semibold">{activities.length}</h3>
              </div>
              <div className="text-center rounded-md pt-2 pb-2 bg-zinc-100 hover:bg-zinc-200">
                <p className="text-xs text-gray-600">Temps Total</p>
                <h3 className="text-xl font-semibold">{totalTime.toFixed(0)} h</h3>
              </div>
              <div className="text-center rounded-md pt-2 pb-2 bg-zinc-100 hover:bg-zinc-200">
                <p className="text-xs text-gray-600 ">Distance Totale</p>
                <h3 className="text-xl font-semibold">{totalDistance.toFixed(0)} <span>km</span></h3>
              </div>
              <div className="text-center rounded-md pt-2 pb-2 bg-zinc-100 hover:bg-zinc-200">
                <p className="text-xs text-gray-600">Dénivelé Total</p>
                <h3 className="text-xl font-semibold">{totalElevation.toFixed(0)} m</h3>
              </div>
            </div>
          </div>)
        }
      </div>
    </div>
  );
};

export default Profile;