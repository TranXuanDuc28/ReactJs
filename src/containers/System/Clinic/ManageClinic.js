import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils, LANGUAGE } from "../../../utils";
import {
  createNewClinic,
  getAllClinic,
  getAllDetailClinicById,
} from "../../../services/userServices";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import { CRUD_ACTION } from "../../../utils";
import { get } from "lodash";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      imageBase64: "",
      contentHTML: "",
      contentMarkdown: "",
      hasOldData: false,
      arrAllClinic: [],
      selectedOption: "",
    };
  }

  async componentDidMount() {
    await this.getAllClinic();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      await this.getAllClinic();
    }
  }
  getAllClinic = async () => {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      let dataSelect = this.buildDataInputSelect(res.data, "CLINICS");
      this.setState({
        arrAllClinic: dataSelect,
      });
    }
  };
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let language = this.props.language;
    if (inputData && inputData.length > 0) {
      if (type === "CLINICS") {
        inputData.map((item, index) => {
          let object = {};
          let labelEn = `${item.name}`;
          let labelVi = `${item.name}`;
          object.value = item.id;
          object.label = language === LANGUAGE.VI ? labelVi : labelEn;
          result.push(object);
        });
      }
    }
    return result;
  };
  handleOnchangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  handleEditorChange = ({ html, text }) => {
    console.log("html: " + html + " text :" + text);
    this.setState({
      contentHTML: html,
      contentMarkdown: text,
    });
  };
  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
      console.log("imageBase", this.state.imageBase64);
    }
  };
  handleSaveNewClinic = async () => {
    let { hasOldData } = this.state;
    let res = await createNewClinic({
      clinicId: this.state.selectedOption.value,
      name: this.state.name,
      address: this.state.address,
      imageBase64: this.state.imageBase64,
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      action: hasOldData === true ? CRUD_ACTION.UPDATE : CRUD_ACTION.CREATE,
    });
    if (res && res.errCode === 0) {
      toast.success(res.errMessage);
      this.setState({
        name: "",
        address: "",
        imageBase64: "",
        contentHTML: "",
        contentMarkdown: "",
      });
    } else {
      toast.error("Something wrongs...");
    }
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    if (selectedOption) {
      console.log("selectedOption", selectedOption);
      let id = selectedOption.value;
      let res = await getAllDetailClinicById({ id });
      console.log("check res ...", res);
      if (res && res.errCode === 0 && res.data) {
        this.setState({
          name: res.data.name,
          address: res.data.address,
          imageBase64: res.data.image,
          contentHTML: res.data.clinicMarkdown[0].contentHTML,
          contentMarkdown: res.data.clinicMarkdown[0].contentMarkdown,
          hasOldData: true,
        });
        console.log("check data", res.data.clinicMarkdown[0]);
      } else {
        // Nếu không có dữ liệu, reset form về trạng thái tạo mới
        this.setState({
          name: "",
          address: "",
          imageBase64: "",
          contentHTML: "",
          contentMarkdown: "",
          hasOldData: false,
        });
      }
    }
  };
  render() {
    let { hasOldData } = this.state;
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lý \phòng khám</div>

        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên phòng khám</label>
            <CreatableSelect
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.arrAllClinic}
              placeholder="Chọn hoặc nhập tên phòng khám..."
              onCreateOption={(inputValue) => {
                // Khi nhập tên mới
                const newOption = { value: null, label: inputValue };
                this.setState({
                  selectedOption: newOption,
                  name: inputValue, // Gán vào state name để khi lưu sẽ dùng
                  hasOldData: false, // Chế độ tạo mới
                });
              }}
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh phòng khám</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnchangeImage(event)}
            />
          </div>
          <div className="col-6 form-group">
            <label>Địa chỉ phòng phám</label>
            <input
              className="form-control"
              type="text"
              value={this.state.address}
              onChange={(event) => this.handleOnchangeInput(event, "address")}
            />
          </div>
          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.contentMarkdown}
            />
          </div>
          <div className="col-12">
            <button
              onClick={() => this.handleSaveNewClinic()}
              className={
                hasOldData === true
                  ? "btn-edit-specialty"
                  : "btn-save-specialty"
              }
            >
              {hasOldData === true ? "Lưu thông tin" : "Tạo thông tin"}
            </button>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
