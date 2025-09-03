import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const Alert = ({
  type = 'success',
  message,
  title,
  duration = 5000,
  onClose,
  className = '',
  showIcon = true,
  closable = true
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          closeIcon: 'text-green-600 hover:bg-green-100'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
          closeIcon: 'text-yellow-600 hover:bg-yellow-100'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          closeIcon: 'text-red-600 hover:bg-red-100'
        };
      case 'info':
        return {
          container: 'bg-puce1-50 border-puce1-200 text-puce1-800',
          icon: <AlertCircle className="w-5 h-5 text-puce1-600" />,
          closeIcon: 'text-puce1-600 hover:bg-puce1-100'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
          closeIcon: 'text-gray-600 hover:bg-gray-100'
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`flex items-start gap-3 p-4 rounded-lg border ${styles.container} ${className} shadow-sm`}
        >
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {styles.icon}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold mb-1">
                {title}
              </h4>
            )}
            <p className="text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {closable && (
            <button
              onClick={handleClose}
              className={`flex-shrink-0 p-1 rounded-full transition-colors duration-200 ${styles.closeIcon}`}
              aria-label="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
