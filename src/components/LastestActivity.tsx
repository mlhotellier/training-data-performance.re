import React from "react";
import { LatestActivityProps } from "../types";
import Loader from "./Loader";

const LatestActivity: React.FC<LatestActivityProps> = ({ activities }) => {
    return (
        <div className="">
            <div className="w-full bg-white shadow-md rounded-2xl p-4 mb-4">
                <h2 className="text-xl font-semibold mb-4">5 dernières activités</h2>
                {!activities || activities.length === 0 ? (
                    <Loader />
                ) : (
                    <div>
                        {activities.slice(0, 5).map((activity, i) => (
                            <div
                                key={i}
                                className="bg-zinc-100 hover:bg-zinc-200 p-4 rounded-lg hover:shadow mb-2"
                            >
                                <p className="text-gray-900 relative">
                                    {new Date(activity.start_date).toLocaleDateString()} -{" "}
                                    <strong>{activity.sport_type}</strong>
                                    <span className="ml-2 text-gray-600 absolute right-4">
                                        {activity.average_heartrate.toFixed(0)}♡
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestActivity;
