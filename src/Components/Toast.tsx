import React from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";

export interface IToastProps {
  message: string;
  type: 'loading' | 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<IToastProps> = ({ message, type, onClose }) => {
  // Dynamic background based on type
  const bgStyles = {
    loading: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    error: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-xl border shadow-lg transition-all duration-300 w-[90%] max-w-[600px] ${bgStyles[type]}`}>
      <span className="text-lg font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
        <IoCloseCircleOutline size={24} />
      </button>
    </div>
  );
};

export default Toast;