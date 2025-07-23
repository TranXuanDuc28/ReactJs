import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import { handlePatientChatLogin } from '../../services/userServices';
import './LoginModal.scss';

const LoginModal = ({ onClose, onLoginSuccess, patientLoginSuccess  }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async () => {
    setErrMessage("");
    setIsLoading(true);

    try {
      console.log("formData",formData)
      const data = await handlePatientChatLogin(formData.username, formData.password);
      console.log("data",data)
      
      if (data && data.errCode !== 0) {
        setErrMessage(data.errMessage);
      } else if (data && data.errCode === 0) {
        patientLoginSuccess(data.users);
        // this.props.patientLoginSuccess(data.users);
        onLoginSuccess();
        console.log("Đăng nhập thành công!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrMessage(error.response.data.errMessage);
      } else {
        setErrMessage("Có lỗi xảy ra khi đăng nhập");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Đăng nhập để chat</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              className="form-control"
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="password-input">
              <input
                className="form-control"
                type={isShowPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu..."
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <span 
                className="password-toggle"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                <i className={isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
              </span>
            </div>
          </div>

          {errMessage && (
            <div className="error-message">
              {errMessage}
            </div>
          )}

          <button
            className="btn-login"
            onClick={handleLogin}
            disabled={isLoading || !formData.username || !formData.password}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <div className="modal-footer">
            <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
      lang: state.app.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    patientLoginSuccess: (patientInfo) => dispatch(actions.patientLoginSuccess(patientInfo)),
    patientLoginFail: () => dispatch(actions.patientLoginFail()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal); 