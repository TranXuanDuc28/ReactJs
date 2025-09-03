import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { CRUD_ACTION, LANGUAGE } from "../../../utils";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "../../../utils/constant";
import {
  getScheduleDoctorByDate,
  getExtraDoctorInforByIdServices,
} from "../../../services/doctorServices";
import { FormattedMessage } from "react-intl";
import "./DoctorExtraInfor.scss";
import NumberFormat from "react-number-format";
import { LANGUAGES } from "../../../utils";
class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDoctorExtraInfor: false,
      extraInfor: [],
    };
  }
  async componentDidMount() {
    if (this.props.doctorIdFromParent) {
      let res = await getExtraDoctorInforByIdServices(
        this.props.doctorIdFromParent,
        this.props.language
      );
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      let res = await getExtraDoctorInforByIdServices(
        this.props.doctorIdFromParent,
        this.props.language
      );
      if (res && res.errCode == 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
    if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
      let res = await getExtraDoctorInforByIdServices(
        this.props.doctorIdFromParent,
        this.props.language
      );
      if (res && res.errCode == 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  showDoctorExtraInfor = (status) => {
    this.setState({
      showDoctorExtraInfor: status,
    });
  };

  render() {
    let { showDoctorExtraInfor, extraInfor } = this.state;
    let { language } = this.props;
    console.log("state", this.state);
    return (
      <div className="doctor-extra-infor-container">
        <div className="content-up">
          <div className="text-address">
            {" "}
            <FormattedMessage id="patient.extra-infor-doctor.text-address" />
          </div>
          <div className="name-clinic">
            {" "}
            {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ""}
          </div>
          <div className="detail-address">
            {extraInfor && extraInfor.addressClinic
              ? extraInfor.addressClinic
              : ""}
          </div>
        </div>
        <div className="content-down">
          {showDoctorExtraInfor == false && (
            <div className="short-infor">
              <FormattedMessage id="patient.extra-infor-doctor.price" />
              {extraInfor &&
                extraInfor.priceTypeData &&
                language === LANGUAGE.VI && (
                  <NumberFormat
                    value={extraInfor.priceTypeData.valueVi}
                    className="currency me-2"
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"VND"}
                  />
                )}
              {extraInfor &&
                extraInfor.priceTypeData &&
                language === LANGUAGE.EN && (
                  <NumberFormat
                    value={extraInfor.priceTypeData.valueEn}
                    className="currency me-2"
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"$"}
                  />
                )}
              <span onClick={() => this.showDoctorExtraInfor(true)}>
                <FormattedMessage id="patient.extra-infor-doctor.detail" />
              </span>
            </div>
          )}

          {showDoctorExtraInfor == true && (
            <>
              <div className="title-price">
                <FormattedMessage id="patient.extra-infor-doctor.price" />{" "}
              </div>
              <div className="detail-infor">
                <div className="price">
                  <div className="left">
                    {" "}
                    <FormattedMessage id="patient.extra-infor-doctor.price" />
                  </div>
                  <div className="right">
                    {extraInfor &&
                      extraInfor.priceTypeData &&
                      language === LANGUAGE.VI && (
                        <NumberFormat
                          value={extraInfor.priceTypeData.valueVi}
                          className="currency"
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"VND"}
                        />
                      )}
                    {extraInfor &&
                      extraInfor.priceTypeData &&
                      language === LANGUAGE.EN && (
                        <NumberFormat
                          value={extraInfor.priceTypeData.valueEn}
                          className="currency"
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"$"}
                        />
                      )}
                  </div>
                </div>
                <div className="note">{extraInfor.note}</div>
              </div>
              <div className="payment">
                <FormattedMessage id="patient.extra-infor-doctor.payment" />
                <span>
                  {extraInfor.paymentTypeData &&
                    language === LANGUAGE.EN &&
                    extraInfor.paymentTypeData.valueEn}
                  {extraInfor.paymentTypeData &&
                    language === LANGUAGE.VI &&
                    extraInfor.paymentTypeData.valueVi}
                </span>
              </div>
              <div className="hide-price">
                <span onClick={() => this.showDoctorExtraInfor(false)}>
                  <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
                </span>
              </div>
            </>
          )}
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
