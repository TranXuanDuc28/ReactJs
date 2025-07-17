import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import * as actions from "../../../store/actions";
import { CRUD_ACTION, dateFormat, LANGUAGE } from "../../../utils";
import Select from "react-select";
import "./ManageSchedule.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { ToastContainer, toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import "../../../utils/constant";
import { saveBulkScheduleDoctor } from "../../../services/doctorServices";
class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: {},
      currentDate: "",
      arrAllDoctor: [],
      rangeTime: [],
    };
  }
  componentDidMount() {
    this.props.getAllDoctor();
    this.props.getAllScheduleTime();
    console.log(this.props);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listAllDoctorRedux !== this.props.listAllDoctorRedux) {
      let dataSelect = this.buildDataInputSelect(this.props.listAllDoctorRedux);
      this.setState({
        arrAllDoctor: dataSelect,
      });
    }
    if (prevProps.allScheduleTimeRedux !== this.props.allScheduleTimeRedux) {
      let data = this.props.allScheduleTimeRedux;
      if (data && data.length > 0) {
        data = data.map((item) => ({
          ...item,
          isSelected: false,
        }));
      }
      this.setState({
        rangeTime: data,
      });
    }
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(this.props.listAllDoctorRedux);

      this.setState({
        arrAllDoctor: dataSelect,
      });
    }
  }
  handleChange = async (selectedOption) => {
    this.setState({
      selectedOption,
    });
  };
  buildDataInputSelect = (inputData) => {
    let result = [];
    let language = this.props.language;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelEn = `${item.lastName} ${item.firstName}`;
        let labelVi = `${item.firstName} ${item.lastName}`;
        object.value = item.id;
        object.label = language === LANGUAGE.VI ? labelVi : labelEn;

        result.push(object);
      });
    }
    return result;
  };
  handleOnChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };
  handleClickBtnTime = (time) => {
    let rangeTime = this.state.rangeTime;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) {
          item.isSelected = !item.isSelected;
        }
        return item;
      });

      this.setState({
        rangeTime: rangeTime,
      });
    }
  };
  handleSaveSchedule = async () => {
    let { rangeTime, selectedOption, currentDate } = this.state;
    let result = [];
    if (!selectedOption && _.isEmpty(selectedOption)) {
      toast.warn("Vui lòng chọn bác sĩ");
      return;
    }
    if (!currentDate) {
      toast.warn("Vui lòng chọn thời gian");
      return;
    }
    // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
    // let formatedDate = moment(currentDate).unix();
    let formatedDate = new Date(currentDate).getTime();
    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((schedule, index) => {
          let object = {};
          object.doctorId = selectedOption.value;
          object.date = formatedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }
    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedOption.value,
      formatedDate: formatedDate,
    });
    if (res) {
      toast.success("Đặt lịch hẹn thành công!");
    }
    console.log("check res", res);
  };
  render() {
    let rangeTime = this.state.rangeTime;
    console.log("check", rangeTime);
    let language = this.props.language;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
      <div className="manage-schedule-container">
        <div className="manage-schedule-title">
          Quản lí kế hoạch khám bệnh của Bác sĩ
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label>Chọn bác sĩ</label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.arrAllDoctor}
            />
          </div>
          <div className="content-right form-group">
            <label>Chọn ngày</label>
            <DatePicker
              onChange={this.handleOnChangeDatePicker}
              className="form-control"
              value={this.state.currentDate}
              minDate={yesterday}
            />
          </div>
        </div>
        <div className="pick-hour-container col-12">
          {rangeTime &&
            rangeTime.length > 0 &&
            rangeTime.map((item, index) => {
              return (
                <button
                  className={
                    item.isSelected === true
                      ? "btn btn-schedule active"
                      : "btn btn-schedule"
                  }
                  key={index}
                  onClick={() => this.handleClickBtnTime(item)}
                >
                  {language === LANGUAGE.VI ? item.valueVi : item.valueEn}
                </button>
              );
            })}
        </div>
        <button
          onClick={() => this.handleSaveSchedule()}
          className="btn-save-schedule"
        >
          Lưu thông tin
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    listAllDoctorRedux: state.admin.listAllDoctor,
    allScheduleTimeRedux: state.admin.listScheduleTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDoctor: () => dispatch(actions.getAllDoctor()),
    getAllScheduleTime: () => dispatch(actions.getAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
