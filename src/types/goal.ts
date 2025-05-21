import { Activity } from "./activity";

export type GoalType = "week" | "month";
export type GoalMetric = "distance" | "dénivelé" | "temps" | "nombre d'activité";

export interface Goal {
  _id: string;
  type: GoalType;
  metric: GoalMetric;
  objectif: number;
  echeance: string;
  fixedValue?: number;
}

export interface ObjectivesProps {
  activities: Activity[];
  goals: Goal[];
  onDeleteGoal: (goalId: string) => void;
  onUpdateGoal: (goal: Goal) => void;
  onAddGoal: (goal: Goal) => void;
}