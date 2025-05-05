import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, label, onChange }) => {
  return (
    <label className="flex items-center space-x-3 ml-3">
      <span className="text-blue-500">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-10 h-4 bg-blue-500 rounded-full shadow-inner ${
            checked ? "bg-blue-700" : "bg-blue-500"
          }`}
        ></div>
        <div
          className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${
            checked ? "transform translate-x-full bg-blue-700" : "bg-blue-500"
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;