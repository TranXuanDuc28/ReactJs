import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import * as actions from "../../../store/actions";
import { CRUD_ACTION, dateFormat, LANGUAGE } from "../../../utils";
import Select from "react-select";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { ToastContainer, toast } from "react-toastify";
import _ from "lodash";
import "../../../utils/constant";
import { getAllPatientForDoctor } from "../../../services/userServices";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import { postSendRemedy } from "../../../services/userServices";
// import LoadingOverlay from "react-loading-overlay";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenModalRemedy: false,
      dataModal: {},
      isShowLoading: false,
    };
  }
  async componentDidMount() {
    this.getDataPatient();
  }
  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime();
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formattedDate,
    });
    console.log("check res", res);
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data ? res.data : [],
      });
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
    }
  }

  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };
  handleBtnConfirm = (item) => {
    let data = {
      patientId: item.patientId,
      doctorId: item.doctorId,
      timeType: item.timeType,
      date: item.date,
      email: item.patientData.email,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenModalRemedy: true,
      dataModal: data,
    });
  };
  closeRemedyModal = () => {
    this.setState({
      isOpenModalRemedy: false,
      dataModal: {},
    });
  };
  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    console.log("check dataChild", dataChild);
    console.log("check dataModal", dataModal);
    this.setState({ isShowLoading: true });
    try {
      let res = await postSendRemedy({
        doctorId: dataModal.doctorId,
        patientId: dataModal.patientId,
        timeType: dataModal.timeType,

        email: dataChild.email,
        imagebase64: dataChild.imageBase64,
        language: this.props.language,
        patientName: dataModal.patientName,
      });
      console.log("check res send remedy", res);

      if (res && res.errCode === 0) {
        toast.success("Gửi hóa đơn thành công!");
        this.setState({
          isShowLoading: false,
        });
        this.closeRemedyModal();
        await this.getDataPatient();
      } else {
        toast.error("Gửi hóa đơn thất bại!");
        this.setState({ isShowLoading: false });
      }
    } catch (error) {
      console.error("Error sending remedy:", error);

      toast.error("Đã có lỗi xảy ra khi gửi hóa đơn!");
      this.setState({ isShowLoading: false });
    }
  };

  render() {
    let { dataPatient, isOpenModalRemedy, dataModal } = this.state;
    let language = this.props.language;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
      <>
        {/* <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        > */}
        <div className="manage-schedule-container">
          <div className="manage-schedule-title">
            Quản lí bệnh nhân khám bệnh
          </div>
          <div className="d-flex flex-column">
            <div className="col-4 form-group">
              <label>Chọn ngày</label>
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                minDate={yesterday}
              />
            </div>
            <div className="col-12 form-group">
              <table className="table">
                <tbody>
                  <tr>
                    <th>STT</th>
                    <th>Thời gian</th>
                    <th>Họ tên bệnh nhân</th>
                    <th>Giới tính</th>
                    <th>Địa chỉ</th>
                    <th>Action</th>
                  </tr>
                  {dataPatient && dataPatient.length > 0 ? (
                    dataPatient.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {language === LANGUAGE.VI
                              ? item.timeTypeDataPatient.valueVi
                              : item.timeTypeDataPatient.valueEn}
                          </td>
                          <td>{item.patientData.firstName}</td>

                          <td>
                            {language === LANGUAGE.VI
                              ? item.patientData.genderData.valueVi
                              : item.patientData.genderData.valueEn}
                          </td>
                          <td>{item.patientData.address}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => this.handleBtnConfirm(item)}
                            >
                              Kê khai!
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Không có bệnh nhân hôm nay
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {isOpenModalRemedy && (
          <RemedyModal
            isOpenModal={isOpenModalRemedy}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        )}
        {/* </LoadingOverlay> */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDoctor: () => dispatch(actions.getAllDoctor()),
    getAllScheduleTime: () => dispatch(actions.getAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
