import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { CRUD_ACTION, LANGUAGE } from "../../../utils";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi";
import "../../../utils/constant";
import { getScheduleDoctorByDate } from "../../../services/doctorServices";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
      allDays: [],
      allAvailableTime: [],
      isOpenModalBooking: false,
      dataTime: {},
    };
  }
  async componentDidMount() {
    let { language } = this.props;
    let allDay = this.getArrays(language);
    if (this.props.doctorIdFromParent) {
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDay[0].value
      );
      if (res && res.errCode === 0) {
        this.setState({
          allAvailableTime: res.data ? res.data : [],
        });
      }
    }
    this.setState({
      allDays: allDay,
    });
  }

  getArrays = (language) => {
    let allDay = [];
    for (let i = 0; i < 7; i++) {
      let object = {};

      if (language === LANGUAGE.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${ddMM}`;
          object.label = today;
        } else {
          object.label = this.capitalizeFirst(
            moment(new Date()).add(i, "days").format("dddd - DD/MM")
          );
        }
      } else {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Today - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
        }
      }

      object.value = moment(new Date())
        .add(i, "days")
        .startOf("days")
        .valueOf();
      allDay.push(object);
    }
    return allDay;
  };
  handleChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent != -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      let res = await getScheduleDoctorByDate(doctorId, date);
      // console.log("res",res)
      if (res && res.errCode === 0) {
        this.setState({
          allAvailableTime: res.data ? res.data : [],
        });
      }
    }
  };
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataTime: time,
    });
    console.log("time", time);
  };
  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      let allDay = this.getArrays(this.props.language);
      this.setState({
        allDays: allDay,
      });
    }
    if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
      let allDay = this.getArrays(this.props.language);
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDay[0].value
      );
      if (res && res.errCode === 0) {
        this.setState({
          allAvailableTime: res.data ? res.data : [],
        });
      }
    }
  }
  render() {
    let { allDays, allAvailableTime, dataTime, isOpenModalBooking } =
      this.state;
    let { language } = this.props;
    // console.log("allAvailableTime",allAvailableTime)
    return (
      <>
        <div className="schedule-container">
          <div className="all-schedule">
            <select onChange={(event) => this.handleChangeSelect(event)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt">
                <span>
                  <FormattedMessage id="patient.detail-doctor.schedule" />
                </span>
              </i>
            </div>
            <div className="time-content">
              {allAvailableTime && allAvailableTime.length > 0 ? (
                allAvailableTime.map((item, index) => {
                  let timeDisplay =
                    language === LANGUAGE.VI
                      ? item.timeTypeData.valueVi
                      : item.timeTypeData.valueEn;
                  return (
                    <button
                      key={index}
                      className={
                        language === LANGUAGE.VI ? "btn-vie" : "btn-en"
                      }
                      onClick={() => this.handleClickScheduleTime(item)}
                    >
                      {timeDisplay}
                    </button>
                  );
                })
              ) : (
                <div>Không có lịch hẹn trong thời gian này</div>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          dataTime={dataTime}
          isOpenModalBooking={isOpenModalBooking}
          closeBookingModal={this.closeBookingModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
