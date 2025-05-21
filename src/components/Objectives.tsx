import React, { useState, useEffect } from "react";
import { GoalType, GoalMetric, Goal, ObjectivesProps } from "../types";
import { calculateTotal, formatDate, formatReadableDate } from "../utils/objectives";
import Loader from "./Loader";
import FullScreenModal from "./FullScreenModal";
import ProgressBar from "./ProgressBar";

const Objectives: React.FC<ObjectivesProps> = ({ activities, goals, onDeleteGoal, onUpdateGoal, onAddGoal }) => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [type, setType] = useState<GoalType>("week");
    const [metric, setMetric] = useState<GoalMetric>("distance");
    const [objectif, setObjectif] = useState<number>(0);
    const [echeance, setEcheance] = useState<string>("");

    // Fonction pour vérifier si un objectif est expiré
    const isExpired = (echeance: string) => {
        const today = new Date();
        const [year, month, day] = echeance.split("-").map(Number);
        // Crée une date locale depuis les parties numériques
        const dueDate = new Date(year, month - 1, day); // mois = 0-based
        // Réinitialise à minuit pour comparer uniquement les jours
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        return today > dueDate;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newGoal: Goal = {
            _id: editingGoal ? editingGoal._id : Date.now().toString(),
            type,
            metric,
            objectif,
            echeance,
        };

        editingGoal ? onUpdateGoal(newGoal) : onAddGoal(newGoal);
        setShowForm(false);
        setEditingGoal(null);
        setType("week");
        setMetric("distance");
        setObjectif(0);
        setEcheance("");
    };

    useEffect(() => {
        if (editingGoal) {
            setType(editingGoal.type);
            setMetric(editingGoal.metric);
            setObjectif(editingGoal.objectif);
            setEcheance(editingGoal.echeance);
        } else {
            setType("week");
            setMetric("distance");
            setObjectif(0);
            setEcheance("");
        }
    }, [editingGoal]);

    const renderGoals = (goalsToRender: Goal[], period: GoalType) =>
        goalsToRender.map((goal) => {
            const total = calculateTotal(activities, goal.type, goal.metric, goal.echeance);
            const progress = (total / goal.objectif) * 100;
            const unit = goal.metric === "distance" ? "km" :
                goal.metric === "dénivelé" ? "m" :
                    goal.metric === "temps" ? "h" : "";

            return (
                <div key={goal._id} className="group relative bg-zinc-100 hover:bg-zinc-200 rounded-2xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-md font-medium text-gray-900">
                            Objectif {goal.metric}
                        </span>
                        <span className="text-lg">{progress >= 100 ? "✅" : (progress.toFixed(0) + " %")}</span>
                    </div>
                    <div><span className="text-xs">{isExpired(goal.echeance) ? `Expiré le ${formatReadableDate(goal.echeance)}` : `Échéance : ${formatReadableDate(goal.echeance)}`}</span></div>
                    <span className="text-sm font-medium text-gray-900">
                        {(goal.metric === "distance")
                            ? total.toFixed(2)
                            : total.toFixed(0)} / {goal.objectif} {unit}
                    </span>
                    <ProgressBar percentage={Math.min(progress, 100)} />
                    <div className="absolute bottom-2 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="text-sm text-orange-500 hover:underline" onClick={() => {
                            setEditingGoal(goal);
                            setShowForm(true);
                        }} >Modifier</button>
                        <button onClick={() => onDeleteGoal(goal._id)} className="text-sm text-red-500 hover:underline">Supprimer</button>
                    </div>
                </div>
            );
        });

    return (
        <div className="col-span-2">
            <div className="flex space-x-4">
                <div className="w-full bg-white shadow-md rounded-2xl p-4 mb-4">
                    <h2 className="text-xl font-semibold mb-4">Objectifs Hebdo</h2>
                    {!activities || activities.length === 0 ? (
                        <Loader />
                    ) : goals.filter(g => g.type === "week").length === 0 ? (
                        <p className="text-gray-500">Aucun objectif hebdomadaire défini.</p>
                    ) : (
                        <>{renderGoals(goals.filter(g => g.type === "week"), "week")}</>
                    )}
                </div>

                <div className="w-full bg-white shadow-md rounded-2xl p-4 mb-4">
                    <h2 className="text-xl font-semibold mb-4">Objectifs Mensuels</h2>
                    {!activities || activities.length === 0 ? (
                        <Loader />
                    ) : goals.filter(g => g.type === "month").length === 0 ? (
                        <p className="text-gray-500">Aucun objectif mensuel défini.</p>
                    ) : (
                        <>{renderGoals(goals.filter(g => g.type === "month"), "month")}</>
                    )}
                </div>

            </div>
            {!activities || activities.length === 0 ? <></> :
                <button className="font-medium w-full center hover:text-blue-400" onClick={() => { setEditingGoal(null); setShowForm(true) }}>+ Ajouter un objectif</button>
            }

            <FullScreenModal isOpen={showForm} onClose={() => setShowForm(false)}>
                <h2 className="text-2xl font-semibold mb-4">{editingGoal ? "Modifier" : "Ajouter"} un objectif</h2>
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-100 p-4 rounded-xl space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value as GoalType)} className="w-full border p-2 rounded">
                            <option value="week">Hebdomadaire</option>
                            <option value="month">Mensuel</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Objectif</label>
                        <input
                            type="number"
                            value={objectif}
                            onChange={(e) => setObjectif(parseFloat(e.target.value))}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Mesure</label>
                        <select value={metric} onChange={(e) => setMetric(e.target.value as GoalMetric)} className="w-full border p-2 rounded">
                            <option value="distance">Distance</option>
                            <option value="dénivelé">Dénivelé</option>
                            <option value="temps">Temps</option>
                            <option value="nombre d'activité">Nombre d'activité</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Échéance</label>
                        <input
                            type="date"
                            value={formatDate(echeance)}
                            onChange={(e) => setEcheance(e.target.value)}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            {editingGoal ? "Modifier" : "Ajouter"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingGoal(null);
                            }}
                            className="text-gray-500 hover:underline"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </FullScreenModal>
        </div>
    );
};

export default Objectives;