import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const goHome = () => {
        navigate('/');
    };

    return (
        <footer className="bg-white shadow-md px-6 py-4 flex justify-center items-center">
            <div
                onClick={goHome}
                className="cursor-pointer"
            >
                <img src="/logo.png" alt="Logo" height={30} width={30} />
            </div>
            <p className='text-gray-700 text-sm mx-3'> © mlh - 2025</p>
        </footer>
    );
};

export default Footer;
