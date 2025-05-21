import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

// Create a global state to manage toast
let toastState = {
  message: '',
  type: 'success' as 'success' | 'error',
  isVisible: false,
  onClose: () => {}
};

let setToastState: (state: typeof toastState) => void;

export function Toast({ message, type = 'success', isVisible, onClose }: ToastProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Store the setState function for external use
  const [state, setState] = React.useState(toastState);
  React.useEffect(() => {
    setToastState = setState;
    toastState = state;
  }, [state]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 hover:opacity-80 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export the toast object with success and error methods
export const toast = {
  success: (message: string) => {
    if (setToastState) {
      setToastState({
        message,
        type: 'success',
        isVisible: true,
        onClose: () => setToastState(prev => ({ ...prev, isVisible: false }))
      });
    }
  },
  error: (message: string) => {
    if (setToastState) {
      setToastState({
        message,
        type: 'error',
        isVisible: true,
        onClose: () => setToastState(prev => ({ ...prev, isVisible: false }))
      });
    }
  }
};