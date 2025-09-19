import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

let toastId = 0;
const toasts: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];

export const toast = {
  success: (message: string) => addToast({ type: 'success', message }),
  error: (message: string) => addToast({ type: 'error', message }),
  info: (message: string) => addToast({ type: 'info', message }),
};

function addToast(toast: Omit<Toast, 'id'>) {
  const newToast = { ...toast, id: (++toastId).toString() };
  toasts.push(newToast);
  notifyListeners();
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(newToast.id);
  }, 5000);
}

function removeToast(id: string) {
  const index = toasts.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    notifyListeners();
  }
}

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]));
}

export const Toaster: React.FC = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToastList(newToasts);
    };
    
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm w-full border rounded-lg shadow-lg p-4 flex items-center space-x-3 ${getStyles(toast.type)} transform transition-all duration-300 ease-in-out`}
        >
          {getIcon(toast.type)}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};