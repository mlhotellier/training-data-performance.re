import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Fonction utilitaire pour vérifier et gérer le token
const checkTokenValidity = (navigate: any) => {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('token_expires_at');

    if (token && expiresAt) {
        const expiresAtNumber = Number(expiresAt);

        if (isNaN(expiresAtNumber)) {
            // Si expiresAt n'est pas un nombre valide
            localStorage.removeItem('token');
            localStorage.removeItem('token_expires_at');
            return;
        }

        if (Date.now() < expiresAtNumber) {
            navigate('/dashboard');
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('token_expires_at');
        }
    }
};

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        checkTokenValidity(navigate); // Vérification du token au chargement
    }, [navigate]);

    const handleLogin = () => {
        const apiUrl = import.meta.env.VITE_SERVER_URL;
        window.location.href = `${apiUrl}/api/auth`;
    };

    const handleUrlToken = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            localStorage.setItem('token', tokenFromUrl);

            const expiresAt = Date.now() + 6 * 60 * 60 * 1000; // 6 heures
            localStorage.setItem('token_expires_at', expiresAt.toString());

            navigate('/dashboard');
        }
    };

    // Si aucun token dans l'URL, vérifier si on doit rediriger vers l'auth
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            handleUrlToken();
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-400 to-blue-500">
            <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
                <img className="mx-auto" src="/logo.png" alt="Logo" height={50} width={50} />
                <h1 className="text-3xl font-bold mt-3 mb-6 text-gray-800">Bienvenue</h1>
                <p className="text-gray-600 mb-8">Connecte-toi à ton compte Strava pour accéder à l'application <span className='font-medium'>Training Data Performance</span>.</p>
                <button
                    onClick={handleLogin}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 w-full"
                >
                    Se connecter avec Strava
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
