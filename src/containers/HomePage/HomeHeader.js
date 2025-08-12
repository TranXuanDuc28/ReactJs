import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGE } from "../../utils";
import { changeLanguage } from "../../store/actions/appActions";
import LoginModal from "../../containers/Auth/LoginModal";
import * as actions from "../../store/actions";
class HomeHeader extends Component {
  state = {
    showLoginModal: false,
    showLogoutMenu: false,
  };

  handleOpenLogin = () => {
    this.setState({ showLoginModal: true });
  };

  handleCloseLogin = () => {
    this.setState({ showLoginModal: false });
  };

  handleLoginSuccess = () => {
    this.setState({ showLoginModal: false });
  };

  handleChangeLanguage = (language) => {
    this.props.changeLanguageRedux(language);
  };

  handleLichHenClick = () => {
    const user = this.props.patientInfo; // Lấy từ redux
    if (user) {
      this.props.history.push("/lich-hen");
    } else {
      this.handleOpenLogin();
    }
  };

  handleAvatarClick = () => {
    const { patientInfo } = this.props;
    if (!patientInfo) {
      this.setState({ showLoginModal: true });
    } else {
      this.setState((prev) => ({ showLogoutMenu: !prev.showLogoutMenu }));
    }
  };

  handleLogout = () => {
    // Dispatch action logout ở đây, ví dụ:
    if (this.props.patientLogout) this.props.patientLogout();
    this.setState({ showLogoutMenu: false });
    // Có thể chuyển hướng về trang chủ nếu muốn
    this.props.history.push("/home");
  };

  render() {
    let language = this.props.language;
    const { patientInfo } = this.props;
    const { showLogoutMenu } = this.state;
    console.log("avatar:", patientInfo);
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <button>
                <i class="fa fa-bars" aria-hidden="true"></i>
              </button>
              <div
                className="header-logo "
                onClick={() => this.props.history.push("/home")}
              ></div>
            </div>
            <div className="center-content">
              <div className="left-child-content">
                <div className="subs-title1 subs-title1-yellow">Tất cả</div>
                <div className="subs-title1">Tại nhà</div>
                <div className="subs-title1">Tại viện</div>
                <div className="subs-title1">Sống khỏe</div>
              </div>
              <div className="right-child-content">
                <div className="search-input">
                  <i class="fa fa-search" aria-hidden="true"></i>
                  <input type="text" placeholder="Tìm gói khám tổng quát" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="schedule" onClick={this.handleLichHenClick}>
                <i class="fa fa-calendar" aria-hidden="true"></i>
                <div className="subs-title2">Lịch hẹn</div>
              </div>
              <div className="chat">
                <i class="fa fa-comments" aria-hidden="true"></i>
                <div
                  className="subs-title2"
                  onClick={() => this.props.history.push("/chat-patient")}
                >
                  Chat với Bác sĩ
                </div>
              </div>
              <div className="support">
                <i class="fa fa-question-circle" aria-hidden="true"></i>
                <div className="subs-title2">
                  <FormattedMessage id="homeheader.support" />
                </div>
              </div>
              <div className="language">
                <div
                  className={
                    language === LANGUAGE.VI
                      ? "subs-title2 active-vi"
                      : "subs-title2"
                  }
                >
                  <span onClick={() => this.handleChangeLanguage(LANGUAGE.VI)}>
                    VI
                  </span>
                </div>
                <div
                  className={
                    language === LANGUAGE.EN
                      ? "subs-title2 active-en"
                      : "subs-title2"
                  }
                >
                  <span onClick={() => this.handleChangeLanguage(LANGUAGE.EN)}>
                    EN
                  </span>
                </div>
              </div>
              {patientInfo ? (
                <div
                  className="d-flex align-items-center ps-3"
                  style={{ position: "relative" }}
                >
                  <img
                    src={
                      patientInfo?.avatar
                        ? patientInfo.avatar
                        : "https://res.cloudinary.com/dehvr55kl/image/upload/v1754732538/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL_tyysti.jpg"
                    }
                    alt="avatar"
                    className="rounded-circle"
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      marginRight: 10,
                      border: "2px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={this.handleAvatarClick}
                  />
                  <div className="d-flex flex-column">
                    <span className="fw-bold" style={{ fontSize: "14px" }}>
                      {patientInfo
                        ? `${patientInfo.firstName} ${patientInfo.lastName}`
                        : ""}
                    </span>
                  </div>
                  {/* Menu logout */}
                  {patientInfo && showLogoutMenu && (
                    <div
                      style={{
                        position: "absolute",
                        top: 50,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        zIndex: 100,
                        minWidth: 120,
                        padding: 8,
                      }}
                    >
                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={this.handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="d-flex align-items-center ps-3"
                  style={{ position: "relative" }}
                >
                  <img
                    src={
                      "https://res.cloudinary.com/dehvr55kl/image/upload/v1754732538/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL_tyysti.jpg"
                    }
                    alt="avatar"
                    className="rounded-circle"
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      marginRight: 10,
                      border: "2px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={this.handleAvatarClick}
                  />
                  <div className="d-flex flex-column">
                    <span className="fw-bold" style={{ fontSize: "14px" }}>
                      Khách
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {this.props.isShowBanner === true && (
            <div className="home-banner-content"></div>
          )}
        </div>
        {this.state.showLoginModal && (
          <LoginModal
            onClose={this.handleCloseLogin}
            onLoginSuccess={this.handleLoginSuccess}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    patientInfo: state.patient.patientInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageRedux: (language) => dispatch(changeLanguage(language)),
    patientLogout: () => dispatch(actions.patientLogout()), // Thay bằng action logout thực tế của bạn
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
