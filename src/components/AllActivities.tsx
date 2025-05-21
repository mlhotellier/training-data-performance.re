import React, { useState } from 'react';
import ActivityCard from './ActivityCard';
import Loader from './Loader';

const AllActivities = ({ activities }: { activities: any[] }) => {
    const [page, setPage] = useState(1);
    const [sportTypeFilter, setSportTypeFilter] = useState("Tous");
    const sportsAvailable = Array.from(new Set(activities.map(a => a.sport_type)));
    const filteredActivities = sportTypeFilter === "Tous"
        ? activities
        : activities.filter(a => a.sport_type === sportTypeFilter);
    const totalPages = Math.ceil(filteredActivities.length / 5);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-8 relative">
            <h2 className="text-xl font-semibold mb-4">Toutes les activités</h2>
            {!activities ? (
                <Loader />
            ) : (
                <>
                    {/* --- FILTRE SPORT TYPE --- */}
                    <div className="mb-4 flex items-center space-x-2 absolute top-4 right-4">
                        <label className="text-sm font-medium">Filtrer par sport :</label>
                        <select
                            value={sportTypeFilter}
                            onChange={(e) => {
                                setSportTypeFilter(e.target.value);
                                setPage(1); // reset page au changement de filtre
                            }}
                            className="p-2 rounded bg-white shadow"
                        >
                            <option value="Tous">Tous</option>
                            {sportsAvailable.map(sport => (
                                <option key={sport} value={sport}>{sport}</option>
                            ))}
                        </select>
                    </div>

                    {/* --- ACTIVITÉS --- */}
                    <div className='mt-8'>
                        {filteredActivities.slice((page - 1) * 5, page * 5).map(activity => (
                            <ActivityCard key={activity.activityId} activity={activity} />
                        ))}
                    </div>

                    {/* --- PAGINATION --- */}
                    <div className="flex justify-center space-x-2 mt-4">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-4 py-2">{page}</span>
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={page >= totalPages}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AllActivities;