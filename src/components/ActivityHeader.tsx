import { LogOut, RefreshCcw, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { fetchActivities, syncStravaActivities } from '../services/apiServices';
import { Activity } from '../types';

const Header = () => {
    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        // Effacer le localStorage et sessionStorage
        localStorage.removeItem('token');
        localStorage.removeItem('token_expires_at');
        sessionStorage.clear();

        // Mettre à jour l'état d'authentification
        setIsAuthenticated(false);

        // Rediriger vers la page de connexion
        navigate('/');
    };

    const goHome = () => {
        navigate('/');
    };

    const currentDate = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <div
                onClick={goHome}
                className="text-xl font-semibold text-blue-600 flex items-center cursor-pointer"
            >
                <img src="/logo.png" alt="Logo" height={30} width={30} />
                <span className="ml-4 font-bold truncate">Training Data Performance</span>
            </div>

            <div className="flex items-center gap-x-4 text-sm text-gray-600">
                <span className="hidden sm:inline">{currentDate}</span>
                <button
                    className="flex items-center text-red-600 hover:text-red-800 hover:bg-gray-100 p-2 rounded transition"
                    onClick={handleLogout}
                    aria-label="Déconnexion"
                    title="Déconnexion"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;
