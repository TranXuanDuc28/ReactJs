import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { values } from "lodash";
import { CRUD_ACTION, LANGUAGE } from "../../../utils";
import "./ManageDoctor.scss";
import { getDetailDoctorByIdServices } from "../../../services/doctorServices";
import { FormattedMessage } from "react-intl";

const mdParser = new MarkdownIt(/* Markdown-it options */);
const options = [
  { values: "Tran Xuan Duc", label: "Tran Xuan Duc" },
  { values: "Tran Duc", label: "Tran Duc" },
];

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // doctorId: 0, save infor to markdown table
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description: "",
      arrAllDoctor: [],
      hasOldData: false,

      // save to doctor_infor tabel
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],

      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",

      nameClinic: "",
      addressClinic: "",
      note: "",

      arrAllPrice: [],
      arrAllPayment: [],
      arrAllProvince: [],
    };
  }

  componentDidMount() {
    this.props.getAllDoctor();
    this.props.fetchAllRequireDoctorInforStart();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listAllDoctorRedux !== this.props.listAllDoctorRedux) {
      let dataSelect = this.buildDataInputSelect(
        this.props.listAllDoctorRedux,
        "USERS"
      );
      this.setState({
        arrAllDoctor: dataSelect,
      });
    }
    if (
      prevProps.listRequireDoctorInforRedux !==
      this.props.listRequireDoctorInforRedux
    ) {
      let { resPrice, resPayment, resProvince, resSpecialty } =
        this.props.listRequireDoctorInforRedux;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      let dataSelectSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );
      let dataSelectClinic = this.buildDataInputSelect(
        this.props.listRequireDoctorInforRedux.resClinic,
        "CLINIC"
      );
      this.setState({
        arrAllPrice: dataSelectPrice,
        arrAllPayment: dataSelectPayment,
        arrAllProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic,
      });
    }
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.listAllDoctorRedux,
        "USERS"
      );
      let { resPrice, resPayment, resProvince } =
        this.props.listRequireDoctorInforRedux;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      this.setState({
        arrAllDoctor: dataSelect,
        arrAllPrice: dataSelectPrice,
        arrAllPayment: dataSelectPayment,
        arrAllProvince: dataSelectProvince,
      });
    }
  }
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };
  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;
    this.props.saveInforDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_ACTION.UPDATE : CRUD_ACTION.CREATE,

      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId:
        this.state.selectedClinic && this.state.selectedClinic.value
          ? this.state.selectedClinic.value
          : "",
      specialtyId: this.state.selectedSpecialty.value,
    });
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({
      selectedOption,
    });
    let {
      arrAllPrice,
      arrAllPayment,
      arrAllProvince,
      listSpecialty,
      listClinic,
    } = this.state;

    let res = await getDetailDoctorByIdServices(selectedOption.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      // console.log(" dataSelection", res.data)

      let markdown = res.data.Markdown;
      let addressClinic = "",
        nameClinic = "",
        note = "",
        selectedPrice = "",
        selectedPayment = "",
        selectedProvince = "",
        selectedSpecialty = "",
        selectedClinic = "",
        specialtyId = "",
        clinicId = "",
        priceId = "",
        paymentId = "",
        provinceId = "";
      if (res.data.Doctor_Infor) {
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;
        priceId = res.data.Doctor_Infor.priceId;
        paymentId = res.data.Doctor_Infor.paymentId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;

        selectedPrice = arrAllPrice.find((item) => {
          return item && item.value === priceId;
        });
        selectedPayment = arrAllPayment.find((item) => {
          return item && item.value === paymentId;
        });
        selectedProvince = arrAllProvince.find((item) => {
          return item && item.value === provinceId;
        });
        selectedProvince = arrAllProvince.find((item) => {
          return item && item.value === provinceId;
        });
        selectedSpecialty = listSpecialty.find((item) => {
          return item && item.value === specialtyId;
        });
        selectedClinic = listClinic.find((item) => {
          return item && item.value === clinicId;
        });
      }
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        note: note,
        selectedPrice: selectedPrice,
        selectedPayment: selectedPayment,
        selectedProvince: selectedProvince,
        selectedSpecialty: selectedSpecialty,
        hasOldData: true,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        addressClinic: "",
        nameClinic: "",
        note: "",
        selectedPrice: "",
        selectedPayment: "",
        selectedProvince: "",
        selectedSpecialty: "",
        hasOldData: false,
      });
    }
  };
  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    // console.log("stateName",stateName)
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };
  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let language = this.props.language;
    if (inputData && inputData.length > 0) {
      // console.log("inputData",inputData)
      if (type === "USERS") {
        inputData.map((item, index) => {
          let object = {};
          let labelEn = `${item.lastName} ${item.firstName}`;
          let labelVi = `${item.firstName} ${item.lastName}`;
          object.value = item.id;
          object.label = language === LANGUAGE.VI ? labelVi : labelEn;

          result.push(object);
        });
      }
      if (type === "PRICE") {
        inputData.map((item, index) => {
          let object = {};
          let labelEn = `${item.valueEn} USD `;
          let labelVi = `${item.valueVi}`;
          object.value = item.keyMap;
          object.label = language === LANGUAGE.VI ? labelVi : labelEn;

          result.push(object);
        });
      }
      if (type === "PAYMENT" || type === "PROVINCE") {
        inputData.map((item, index) => {
          let object = {};
          let labelEn = `${item.valueEn}`;
          let labelVi = `${item.valueVi}`;
          object.value = item.keyMap;
          object.label = language === LANGUAGE.VI ? labelVi : labelEn;

          result.push(object);
        });
      }
      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.value = item.id;
          object.label = item.name;
          result.push(object);
        });
      }
      if (type === "CLINIC") {
        inputData.map((item, index) => {
          let object = {};
          object.value = item.id;
          object.label = item.name;
          result.push(object);
        });
      }
    }
    return result;
  };
  render() {
    let { hasOldData, listSpecialty, listClinic } = this.state;
    console.log("listClinic", listClinic);
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">Thêm thông tin bác sĩ</div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label>Chọn bác sĩ</label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.arrAllDoctor}
            />
          </div>
          <div className="content-right form-group">
            <label>Thông tin giới thiệu</label>
            <textarea
              className="form-control"
              rows="4"
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              value={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-detail">
          <div className="col-4 form-group">
            <label>Giá khám bệnh</label>
            <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.arrAllPrice}
              name="selectedPrice"
            />
          </div>
          <div className="col-4 form-group">
            <label>Phương thức thanh toán</label>
            <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.arrAllPayment}
              name="selectedPayment"
            />
          </div>
          <div className="col-4 form-group">
            <label>Tỉnh thành</label>
            <Select
              value={this.state.selectedProvince}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.arrAllProvince}
              name="selectedProvince"
            />
          </div>
          <div className="col-4 form-group">
            <label>Tên phòng khám </label>
            <input
              type="text"
              onChange={(event) => this.handleOnChangeText(event, "nameClinic")}
              value={this.state.nameClinic}
              className="form-control"
            />
          </div>
          <div className="col-4 form-group">
            <label>Địa chỉ phòng khám</label>
            <input
              type="text"
              onChange={(event) =>
                this.handleOnChangeText(event, "addressClinic")
              }
              value={this.state.addressClinic}
              className="form-control"
            />
          </div>
          <div className="col-4 form-group">
            <label>Ghi chú</label>
            <input
              type="text"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
              className="form-control"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.specialty" />
            </label>
            <Select
              value={this.state.selectedSpecialty}
              options={this.state.listSpecialty}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.specialty" />
              }
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedSpecialty"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.select-clinic" />
            </label>
            <Select
              value={this.state.selectedClinic}
              options={this.state.listClinic}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.select-clinic" />
              }
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedClinic"
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>
        <button
          onClick={() => this.handleSaveContentMarkdown()}
          className={
            hasOldData === true ? "btn-edit-doctor" : "btn-save-doctor"
          }
        >
          {hasOldData === true ? "Lưu thông tin" : "Tạo thông tin"}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    listAllDoctorRedux: state.admin.listAllDoctor,
    listRequireDoctorInforRedux: state.admin.listAllRequireDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDoctor: () => dispatch(actions.getAllDoctor()),
    saveInforDoctor: (data) => dispatch(actions.saveDetailInforDoctor(data)),
    fetchAllRequireDoctorInforStart: () =>
      dispatch(actions.fetchAllRequireDoctorInforStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
