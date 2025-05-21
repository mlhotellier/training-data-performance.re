import React from "react";
import { FastestKmBlockProps } from "../types";
import { formatDuration } from "../utils/records";

const FastestKmBlock: React.FC<FastestKmBlockProps> = ({ records }) => {
  return (
    <div className="rounded-2xl bg-white shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Records sur la séance</h2>
      <div className="flex">
        {records.map((record) => (
          <div
            key={record.distance}
            className="p-6 flex flex-col items-center justify-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Meilleur {record.distance / 1000} km
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatDuration(record.time)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FastestKmBlock;
