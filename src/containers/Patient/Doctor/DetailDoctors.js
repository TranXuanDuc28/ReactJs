import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import "./DetailDoctors.scss";
import "./DoctorSchedule.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "./DoctorSchedule";
import * as actions from "../../../store/actions";
import { LANGUAGE } from "../../../utils";
import DoctorExtraInfor from "./DoctorExtraInfor";
import PatientChatBox from "../../Chat/PatientChatBox"; // sẽ tạo mới file này
class DetailDoctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctorbyId: [],
      currentDoctorId: "-1",
      showChatBox: false, // Thêm state này
    };
  }
  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.props.getDetailDoctorById(id);
      this.setState({
        currentDoctorId: this.props.match.params.id,
      });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.detailDoctorRedux !== this.props.detailDoctorRedux) {
      this.setState({
        detailDoctorbyId: this.props.detailDoctorRedux,
      });
    }
  }

  render() {
    let detailDoctorbyId = this.state.detailDoctorbyId;
    // console.log("check2",this.state.detailDoctorbyId)
    let language = this.props.language;
    let nameVi = "",
      nameEn = "";
    if (detailDoctorbyId && detailDoctorbyId.positionData) {
      nameEn = `${detailDoctorbyId.positionData.valueEn}, ${detailDoctorbyId.lastName} ${detailDoctorbyId.firstName}`;
      nameVi = `${detailDoctorbyId.positionData.valueVi}, ${detailDoctorbyId.firstName} ${detailDoctorbyId.lastName} `;
    }
    return (
      <React.Fragment>
        <HomeHeader isShowBanner={false} />
        <div className="detail-doctor-container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${
                  detailDoctorbyId && detailDoctorbyId.image
                    ? detailDoctorbyId.image
                    : ""
                })`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                borderRadius: "50%",
                width: "130px",
                height: "130px",
                border: "none",
              }}
            ></div>
            <div className="content-right">
              <div className="up">
                {language === LANGUAGE.VI ? nameVi : nameEn}
              </div>
              <div className="down">
                {detailDoctorbyId &&
                  detailDoctorbyId.Markdown &&
                  detailDoctorbyId.Markdown.description && (
                    <span>{detailDoctorbyId.Markdown.description}</span>
                  )}
              </div>
              {/* Nút Liên hệ */}
              <button
                className="btn btn-primary mt-3"
                onClick={() => this.setState({ showChatBox: true })}
                style={{ minWidth: 120 }}
              >
                Liên hệ
              </button>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
            </div>
            <div className="content-right">
              <DoctorExtraInfor
                doctorIdFromParent={this.state.currentDoctorId}
              />
            </div>
          </div>
          <div className="detail-infor-doctor">
            {detailDoctorbyId &&
              detailDoctorbyId.Markdown &&
              detailDoctorbyId.Markdown.contentHTML && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: detailDoctorbyId.Markdown.contentHTML,
                  }}
                ></div>
              )}
          </div>
          <div className="comment-doctor"></div>
        </div>
        {/* Popup Chatbox */}
        {this.state.showChatBox && (
          <PatientChatBox
            doctor={detailDoctorbyId}
            onClose={() => this.setState({ showChatBox: false })}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    detailDoctorRedux: state.admin.inforDoctorById,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailDoctorById: (id) => dispatch(actions.getDetailDoctorById(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctors);
