import { Activity } from "./activity";

export interface ProfileData {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    profile_medium: string;
    city: string;
    country: string;
    email?: string;
    weight: number;
    profile: string;
    created_at: string;
}

export interface ProfileProps {
    profile: ProfileData | null;
    activities: Activity[];
}
