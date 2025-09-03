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
      lang: "",

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
    this.props.fetchAllRequireDoctorInforStart({ lang: this.props.language });
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
      this.props.getAllDoctor();
      this.props.fetchAllRequireDoctorInforStart();
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
      lang: this.props.language,
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

    let res = await getDetailDoctorByIdServices(
      selectedOption.value,
      this.props.language
    );
    console.log("check res managedoctor", res);
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
        lang: markdown.lang,
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
        lang: this.props.language,
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
    console.log(" this.state", this.state);
    return (
      <div className="manage-doctor-container">
        <div className="container-fluid py-4">
          <div className="text-center mb-4">
            <h3 className="manage-doctor-title fw-bold">
              Quản lý thông tin bác sĩ
            </h3>
            <p className="text-muted">
              Tạo mới hoặc chỉnh sửa thông tin bác sĩ
            </p>
          </div>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  {/* Chọn bác sĩ và mô tả */}
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label fw-bold">
                        <i className="fas fa-user-md me-2"></i>
                        Chọn bác sĩ
                      </label>
                      <Select
                        value={this.state.selectedOption}
                        onChange={this.handleChangeSelect}
                        options={this.state.arrAllDoctor}
                        placeholder="Chọn bác sĩ"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="fas fa-info-circle me-2"></i>
                        Thông tin giới thiệu
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        onChange={(event) =>
                          this.handleOnChangeText(event, "description")
                        }
                        value={this.state.description}
                        placeholder="Nhập mô tả ngắn về bác sĩ..."
                      ></textarea>
                    </div>
                  </div>
                  {/* Thông tin chi tiết */}
                  <div className="row mb-3">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <label className="form-label fw-bold">
                        Giá khám bệnh
                      </label>
                      <Select
                        value={this.state.selectedPrice}
                        onChange={this.handleChangeSelectDoctorInfor}
                        options={this.state.arrAllPrice}
                        name="selectedPrice"
                        placeholder="Chọn giá"
                      />
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <label className="form-label fw-bold">
                        Phương thức thanh toán
                      </label>
                      <Select
                        value={this.state.selectedPayment}
                        onChange={this.handleChangeSelectDoctorInfor}
                        options={this.state.arrAllPayment}
                        name="selectedPayment"
                        placeholder="Chọn phương thức"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Tỉnh thành</label>
                      <Select
                        value={this.state.selectedProvince}
                        onChange={this.handleChangeSelectDoctorInfor}
                        options={this.state.arrAllProvince}
                        name="selectedProvince"
                        placeholder="Chọn tỉnh thành"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <label className="form-label fw-bold">
                        Tên phòng khám
                      </label>
                      <input
                        type="text"
                        onChange={(event) =>
                          this.handleOnChangeText(event, "nameClinic")
                        }
                        value={this.state.nameClinic}
                        className="form-control"
                        placeholder="Nhập tên phòng khám"
                      />
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <label className="form-label fw-bold">
                        Địa chỉ phòng khám
                      </label>
                      <input
                        type="text"
                        onChange={(event) =>
                          this.handleOnChangeText(event, "addressClinic")
                        }
                        value={this.state.addressClinic}
                        className="form-control"
                        placeholder="Nhập địa chỉ phòng khám"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Ghi chú</label>
                      <input
                        type="text"
                        onChange={(event) =>
                          this.handleOnChangeText(event, "note")
                        }
                        value={this.state.note}
                        className="form-control"
                        placeholder="Nhập ghi chú"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label fw-bold">Chuyên khoa</label>
                      <Select
                        value={this.state.selectedSpecialty}
                        options={this.state.listSpecialty}
                        placeholder="Chọn chuyên khoa"
                        onChange={this.handleChangeSelectDoctorInfor}
                        name="selectedSpecialty"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Phòng khám</label>
                      <Select
                        value={this.state.selectedClinic}
                        options={this.state.listClinic}
                        placeholder="Chọn phòng khám"
                        onChange={this.handleChangeSelectDoctorInfor}
                        name="selectedClinic"
                      />
                    </div>
                  </div>
                  {/* Markdown Editor */}
                  <div className="manage-doctor-editor mb-3">
                    <label className="form-label fw-bold mb-2">
                      <i className="fas fa-edit me-2"></i>
                      Nội dung chi tiết
                    </label>
                    <MdEditor
                      style={{ height: "350px" }}
                      renderHTML={(text) => mdParser.render(text)}
                      onChange={this.handleEditorChange}
                      value={this.state.contentMarkdown}
                      placeholder="Nhập nội dung chi tiết về bác sĩ..."
                    />
                  </div>
                  {/* Action Button */}
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => this.handleSaveContentMarkdown()}
                      className={
                        hasOldData === true
                          ? "btn btn-warning btn-edit-doctor"
                          : "btn btn-primary btn-save-doctor"
                      }
                    >
                      {hasOldData === true ? (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Lưu thông tin
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus me-2"></i>
                          Tạo thông tin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    fetchAllRequireDoctorInforStart: (data) =>
      dispatch(actions.fetchAllRequireDoctorInforStart(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
