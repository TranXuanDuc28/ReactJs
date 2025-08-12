import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import { handlePatientChatLogin } from "../../services/userServices";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { jwtDecode } from "jwt-decode";
import "./LoginModal.scss";
import RegisterModal from "./RegisterModal"; // Thêm dòng này

const LoginModal = ({ onClose, onLoginSuccess, patientLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    setErrMessage("");
    setIsLoading(true);

    try {
      console.log("formData", formData);
      const data = await handlePatientChatLogin(
        formData.username,
        formData.password
      );

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
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // Xử lý đăng nhập Google thành công
  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode(credentialResponse.credential);
      const nameParts = decoded.given_name.trim().split(" ");
      const firstName = nameParts.slice(0, -1).join(" "); // bỏ chữ cuối
      const lastName = nameParts[nameParts.length - 1]; // lấy chữ cuối
      // decoded chứa thông tin user Google
      // Bạn có thể gửi lên backend để xác thực hoặc lưu trực tiếp vào redux
      patientLoginSuccess({
        id: decoded.sub.substring(0, 5),
        firstName: firstName,
        lastName: lastName,
        email: decoded.email,
        avatar: decoded.picture,
        isGoogle: true,
      });
      console.log("Đăng nhập Google thành công:", decoded);
      onLoginSuccess();
    }
  };

  const handleFacebookResponse = (response) => {
    console.log("Facebook response:", response);
    if (response && !response.error) {
      patientLoginSuccess({
        id: response.id,
        firstName: response.name.split(" ").slice(0, -1).join(" "),
        lastName: response.name.split(" ").pop(),
        email: response.email,
        avatar: response.picture.data.url,
        isFacebook: true,
      });
      onLoginSuccess();
    } else {
      setErrMessage("Đăng nhập Facebook thất bại");
    }
  };

  return (
    <>
      {!showRegister && (
        <div className="login-modal-overlay" onClick={onClose}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Đăng nhập để tiếp tục</h3>
              <button className="close-btn" onClick={onClose}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Nhập email của bạn..."
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="password-input">
                  <input
                    className="form-control"
                    type={isShowPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu..."
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    <i
                      className={
                        isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"
                      }
                    ></i>
                  </span>
                </div>
              </div>

              {errMessage && <div className="error-message">{errMessage}</div>}

              <button
                className="btn-login"
                onClick={handleLogin}
                disabled={isLoading || !formData.username || !formData.password}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <div style={{ textAlign: "center", margin: "16px 0" }}>
                <div className="social-login-btn">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setErrMessage("Đăng nhập Google thất bại")}
                    size="large" // 'small' hoặc 'medium' tùy thư viện bạn dùng
                    shape="pill" // bo tròn nếu thư viện hỗ trợ
                  />
                </div>

                <div className="social-login-btn">
                  <FacebookLogin
                    appId="2514015902296614"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={handleFacebookResponse}
                    icon="fa-facebook"
                    textButton="&nbsp;Đăng nhập bằng Facebook"
                    cssClass="facebook-custom-btn"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <p>
                  Chưa có tài khoản?{" "}
                  <span
                    style={{ color: "#007bff", cursor: "pointer" }}
                    onClick={() => setShowRegister(true)}
                  >
                    Đăng ký ngay
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onRegisterSuccess={() => {
            setShowRegister(false);
            // Có thể tự động mở lại LoginModal hoặc thông báo đăng ký thành công
          }}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    patientLoginSuccess: (patientInfo) =>
      dispatch(actions.patientLoginSuccess(patientInfo)),
    patientLoginFail: () => dispatch(actions.patientLoginFail()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
