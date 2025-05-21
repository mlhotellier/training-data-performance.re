import React from "react";
import { ProgressBarProps } from "../types/progressbar";

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    return (
        <div className="w-full bg-gray-300 rounded-full h-3 mb-4">
            <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export default ProgressBar;
