import { Goal } from "../types";
const serverUrl = import.meta.env.VITE_SERVER_URL;

const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Erreur inconnue');
    }
    return response.json();
};

export const fetchProfile = async (token: string) => {
    const response = await fetch(`${serverUrl}/api/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return handleApiResponse(response);
};

export const fetchActivities = async (token: string) => {
    const response = await fetch(`${serverUrl}/api/activities`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return handleApiResponse(response);
};

export const fetchGoals = async (token: string) => {
    const response = await fetch(`${serverUrl}/api/goals`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return handleApiResponse(response);
};

export const deleteGoal = async (goalId: string, token: string) => {
    const response = await fetch(`${serverUrl}/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return handleApiResponse(response);
};

export const updateGoal = async (goal: Goal, token: string) => {
    const response = await fetch(`${serverUrl}/api/goals/${goal._id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(goal),
    });
    return handleApiResponse(response);
};

export const addGoal = async (goal: Goal, token: string) => {
    const response = await fetch(`${serverUrl}/api/goals`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(goal),
    });
    return handleApiResponse(response);
};

export const syncStravaActivities = async (token: string) => {
    const response = await fetch(`${serverUrl}/api/activities/full-sync`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return handleApiResponse(response);
};

export const fetchActivityStreams = async (id: string, token: string) => {
    const response = await fetch(`${serverUrl}/api/activities/${id}/streams`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await handleApiResponse(response);

    return {
        streams: data.streams,
        location: data.location,
        weather: data.weather,
    };
};
