import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ size = 'medium', text = 'Đang tải...', fullScreen = false }) => {
    const spinnerClass = `loading-spinner ${size} ${fullScreen ? 'fullscreen' : ''}`;

    return (
        <div className={spinnerClass}>
            <div className="spinner-container">
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
                {text && <p className="loading-text">{text}</p>}
            </div>
        </div>
    );
};

export default LoadingSpinner;
