import React from 'react';
import './Error.css';

const Error = ({ message, onRetry }) => {
  return (
    <div className="error">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <button onClick={onRetry} className="retry-button">Retry</button>
    </div>
  );
};

export default Error;