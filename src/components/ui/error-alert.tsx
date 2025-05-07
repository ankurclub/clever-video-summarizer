
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md bg-red-500 text-white p-4 rounded-md shadow-lg flex items-start">
      <div className="flex-1 mr-3">
        <p>{message}</p>
      </div>
      <button 
        onClick={handleClose}
        className="flex-shrink-0 bg-black/20 hover:bg-black/30 p-1 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ErrorAlert;
