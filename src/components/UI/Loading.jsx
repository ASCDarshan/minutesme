import React from 'react';

const Loading = ({ size = 'medium', message = 'Loading...', fullScreen = false }) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 'h-6 w-6';
      case 'medium':
        return 'h-10 w-10';
      case 'large':
        return 'h-16 w-16';
      default:
        return 'h-10 w-10';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const spinner = (
    <div
      className={`${getSpinnerSize()} rounded-full border-t-2 border-b-2 border-primary animate-spin`}
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="flex flex-col items-center">
          {spinner}
          {message && <p className={`mt-4 text-gray-600 font-medium ${getTextSize()}`}>{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {spinner}
      {message && <p className={`mt-3 text-gray-600 ${getTextSize()}`}>{message}</p>}
    </div>
  );
};

export default Loading;