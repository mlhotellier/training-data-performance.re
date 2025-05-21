import { useEffect, useState } from "react";
import { ProfileData, Goal, Activity } from "../types/index";
import { fetchProfile, fetchActivities, fetchGoals, deleteGoal, updateGoal, addGoal } from "../services/apiServices";
import Header from "../components/Header";
import Profile from "../components/Profile";
import Objectives from "../components/Objectives";
import LastestActivity from "../components/LastestActivity";
import GlobalStats from "../components/GlobalStats";
import ActivitiesPieChart from "../components/ActivitiesPieChart";
import HeartRateStats from "../components/HeartRateStats";
import AllActivities from "../components/AllActivities";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const token = localStorage.getItem('token');

  // ✅ Récupérer le profil utilisateur
  useEffect(() => {
    const storedProfile = sessionStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      const fetchData = async () => {
        try {
          const data = await fetchProfile(token!); // Utilisation du service
          setProfile(data);
          sessionStorage.setItem('profile', JSON.stringify(data));
        } catch (err) {
          console.error("Erreur lors du chargement du profil:", err);
        }
      };
      fetchData();
    }
  }, [token]);

  // ✅ Récupérer les activités
  useEffect(() => {
    const storedActivities = sessionStorage.getItem('activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      const fetchData = async () => {
        try {
          const data = await fetchActivities(token!); // Utilisation du service
          setActivities(data);
          sessionStorage.setItem('activities', JSON.stringify(data));
        } catch (err) {
          console.error("Erreur lors du chargement des activités :", err);
        }
      };
      fetchData();
    }
  }, [token]);

  // ✅ Récupérer les objectifs
  useEffect(() => {
    const storedActivities = sessionStorage.getItem('goals');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      const fetchData = async () => {
        try {
          const data = await fetchGoals(token!); // Utilisation du service
          setGoals(data);
          sessionStorage.setItem('goals', JSON.stringify(data));
        } catch (err) {
          console.error("Erreur lors du chargement des objectifs :", err);
        }
      };
      fetchData();
    }
  }, [token]);

  // ✅ Suppression d'un objectif avec confirmation
  const handleDeleteGoal = async (_id: string) => {
    // Demande une confirmation avant de supprimer
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?");

    if (confirmDelete) {
      try {
        await deleteGoal(_id, token!); // Utilisation du service
        setGoals((prevGoals) => prevGoals.filter(goal => goal._id !== _id));
      } catch (err) {
        console.error("Erreur lors de la suppression de l'objectif :", err);
      }
    }
  };

  // ✅ Modification d'un objectif
  const handleUpdateGoal = async (goal: Goal) => {
    try {
      const savedGoal = await updateGoal(goal, token!); // Utilisation du service
      setGoals(prevGoals => {
        const index = prevGoals.findIndex(g => g._id === savedGoal._id);
        if (index !== -1) {
          const updated = [...prevGoals];
          updated[index] = savedGoal;
          return updated;
        } else {
          return [...prevGoals, savedGoal];
        }
      });
    } catch (error) {
      console.error('Erreur API:', error);
      alert('Une erreur est survenue lors de l’enregistrement de l’objectif');
    }
  };

  // ✅ Ajout d'un objectif
  const handleAddGoal = async (goal: Goal) => {
    try {
      const savedGoal = await addGoal(goal, token!); // Utilisation du service
      setGoals(prevGoals => {
        const index = prevGoals.findIndex(g => g._id === savedGoal._id);
        if (index !== -1) {
          const updated = [...prevGoals];
          updated[index] = savedGoal;
          return updated;
        } else {
          return [...prevGoals, savedGoal];
        }
      });
    } catch (error) {
      console.error('Erreur API:', error);
      alert('Une erreur est survenue lors de l’enregistrement de l’objectif');
    }
  };

  return (
    <div>
      <Header setActivities={setActivities} isSyncing={isSyncing} setIsSyncing={setIsSyncing} />
      <div className="min-h-screen bg-gray-100 p-6">
        {isSyncing ?
          <div className="min-h-screen">
            <Loader />
            <div className="flex flex-col justify-center items-center mt-2">
              <h2 className="text-xl font-semibold mb-2">Rafraîchissement des activité en cours...</h2>
              <p>Cette opération peut prendre quelques minutes. Merci de votre compréhension.</p>
            </div>
          </div>
          :
          <div className="mx-auto mb-6">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <Profile profile={profile} activities={activities} />
              <Objectives activities={activities} goals={goals} onDeleteGoal={handleDeleteGoal} onUpdateGoal={handleUpdateGoal} onAddGoal={handleAddGoal} />
              <LastestActivity activities={activities} />
            </div>
            <GlobalStats activities={activities} />
            <div className="grid grid-cols-3 gap-4 mb-4">
              <ActivitiesPieChart activities={activities} />
              <HeartRateStats activities={activities} />
            </div>
            <AllActivities activities={activities} />
          </div>
        }
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
