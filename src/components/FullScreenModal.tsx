import React from "react";

interface FullScreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-1/2 h-auto p-6 shadow-md rounded-2xl overflow-auto relative">
                <button
                    className="absolute top-6 right-6 text-gray-600 hover:text-red-500 text-xl font-bold"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

export default FullScreenModal;