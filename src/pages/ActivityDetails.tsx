import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Activity, ActivityDetailData, StreamData } from "../types/index";
import ActivityHeader from "../components/ActivityHeader";
import Loader from "../components/Loader";
import BarChart from "../components/BarChart";
import DoughnutChart from "../components/Doughnut";
import NatationGraph from "../components/NatationGraph";
import TrainingGraph from "../components/TrainingGraph";
import FastestKmBlock from "../components/FastestKmBlock";
import ActivityMapSummary from "../components/ActivityMapSummary";
import ActivityChartSection from "../components/ActivityChartSection";
import PaceBySlope from "../components/PaceBySlope";
import Footer from "../components/Footer";
import { getFastestKmsFromStreams } from "../utils/records";
import { fetchActivityStreams } from "../services/apiServices";

const ActivityDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [activity, setActivity] = useState<Activity | null>(null);
    const [streamData, setStreamData] = useState<StreamData | null>(null);
    const [detailData, setDetailData] = useState<ActivityDetailData | null>(null);
    const token = localStorage.getItem('token');
    const allowedTypes = ['Ride', 'Run', 'TrailRun', 'Walk', 'EBikeRide', 'Hike'];
    const fastestRecords = streamData && activity?.activityId ? getFastestKmsFromStreams(streamData, activity.activityId.toString()) : [];

    // ✅ Récuperer l'activité avec l'id
    useEffect(() => {
        const storedActivities = sessionStorage.getItem('activities');
        if (storedActivities) {
            const activities: Activity[] = JSON.parse(storedActivities);
            const foundActivity = activities.find(act => act.activityId === Number(id)) || null;
            setActivity(foundActivity);
        }
    }, [id]);

    // ✅ Récuperer les datas de l'activité
    useEffect(() => {
        const fetchData = async () => {
            if (!id || !token) return;
            const data = await fetchActivityStreams(id, token);
            setStreamData(data.streams);
            setDetailData(data)
        };
        fetchData();
    }, [id, token]);

    useEffect(() => {
        if (activity && streamData) {
            setLoading(false);
        }
    }, [activity, streamData]);

    if (!activity) return <div>404 - Activité non trouvée</div>;

    return (
        <>
            <ActivityHeader />
            <div className="min-h-screen bg-gray-100 p-6">
                {loading ? (
                    <Loader />
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            <span className="font-normal">{new Date(activity.start_date).toLocaleDateString()} - {activity.sport_type} -</span> {activity.name}
                        </h2>

                        {allowedTypes.concat("Hike").includes(activity.sport_type) && detailData && (
                            <ActivityMapSummary detailData={detailData} activity={activity} allowedTypes={allowedTypes} />
                        )}

                        <div className="w-full">
                            {streamData ? (
                                <>
                                    {allowedTypes.concat("Hike").includes(activity.sport_type) && (
                                        <ActivityChartSection
                                            streamData={streamData}
                                        />
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        {activity.sport_type === "Swim" &&
                                            <NatationGraph streamData={streamData} />
                                        }
                                        {["Workout", "WeightTraining"].includes(activity.sport_type) && (
                                            <TrainingGraph streamData={streamData} />
                                        )}
                                        {allowedTypes.includes(activity.sport_type) && (
                                            <BarChart streamData={streamData} />
                                        )}
                                        <DoughnutChart streamData={streamData} />
                                        {["Run", "TrailRun"].includes(activity.sport_type) && (
                                            <PaceBySlope streamData={streamData} />
                                        )}
                                    </div>

                                    {fastestRecords.length > 0 && (
                                        <FastestKmBlock records={fastestRecords} />
                                    )}
                                </>
                            ) : <Loader />}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ActivityDetail;
