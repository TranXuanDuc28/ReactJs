import React, { useState } from "react";
import "./RegisterModal.scss";
import { registerUser } from "../../services/userServices"; // Import hàm đăng ký người dùng
import { first } from "lodash";
import { toast } from "react-toastify";
const RegisterModal = ({ onClose, onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    setErrMessage("");
    setIsLoading(true);
    try {
      const res = await registerUser(formData);
      if (res.errCode === 0) {
        onRegisterSuccess();
        toast.success(res.errMessage);
      } else {
        setErrMessage(res.errMessage);
      }
    } catch (error) {
      setErrMessage("Có lỗi xảy ra khi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-modal-overlay" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Đăng ký tài khoản</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Họ</label>
            <input
              className="form-control"
              type="text"
              placeholder="Nhập họ..."
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Tên</label>
            <input
              className="form-control"
              type="text"
              placeholder="Nhập tên..."
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              placeholder="Nhập email..."
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              className="form-control"
              type="password"
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại liên hệ</label>
            <input
              className="form-control"
              type="text"
              placeholder="Nhập số điện thoại..."
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>
          {errMessage && <div className="error-message">{errMessage}</div>}
          <button
            className="btn-register"
            onClick={handleRegister}
            disabled={
              isLoading ||
              !formData.email ||
              !formData.password ||
              !formData.firstName ||
              !formData.lastName ||
              !formData.phoneNumber
            }
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
          <div
            className="modal-footer"
            style={{ marginTop: 16, textAlign: "center" }}
          >
            <p>
              Đã có tài khoản?{" "}
              <span
                style={{ color: "#007bff", cursor: "pointer" }}
                onClick={onSwitchToLogin}
              >
                Đăng nhập
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
