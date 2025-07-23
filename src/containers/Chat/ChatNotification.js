import React from 'react';
import './ChatNotification.scss';

const ChatNotification = ({ onLoginClick, onClose }) => {
  return (
    <div className="chat-notification">
      <div className="notification-content">
        <div className="notification-icon">
          <i className="fa fa-comments"></i>
        </div>
        <div className="notification-text">
          <h4>Chat với Bác sĩ</h4>
          <p>Để chat với bác sĩ, bạn cần đăng nhập trước</p>
        </div>
        <div className="notification-actions">
          <button className="btn-login" onClick={onLoginClick}>
            Đăng nhập
          </button>
          <button className="btn-close" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatNotification; 