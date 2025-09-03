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
import Lightbox from "react-image-lightbox";
import Select from "react-select";

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
      isSubmitting: false,
      previewImageUrl: "",
      isOpen: false,
      lang: "",
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
    let res = await getAllClinic({ lang: "vi" });
    if (res && res.errCode === 0) {
      console.log("check res", res);
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
        previewImageUrl: URL.createObjectURL(file), // Tạo URL tạm thời để hiển thị ảnh
      });
    }
  };
  openPreviewImage = () => {
    if (!this.state.previewImageUrl) return;
    this.setState({
      isOpen: true,
    });
  };
  validateForm = () => {
    const { name, address, contentMarkdown } = this.state;
    // if (!name) {
    //   toast.error("Vui lòng nhập tên phòng khám");
    //   return false;
    // }
    if (!address) {
      toast.error("Vui lòng nhập địa chỉ phòng khám");
      return false;
    }
    if (!contentMarkdown) {
      toast.error("Vui lòng nhập mô tả phòng khám");
      return false;
    }
    return true;
  };
  handleSaveNewClinic = async () => {
    if (!this.validateForm()) return;
    this.setState({ isSubmitting: true });
    let { hasOldData } = this.state;
    try {
      const clinicData = {
        clinicId: this.state.selectedOption.value,
        name: this.state.name,
        address: this.state.address,
        imageBase64: this.state.imageBase64,
        contentHTML: this.state.contentHTML,
        contentMarkdown: this.state.contentMarkdown,
        action: hasOldData === true ? CRUD_ACTION.UPDATE : CRUD_ACTION.CREATE,
        lang: this.props.language,
      };
      let res = await createNewClinic(clinicData);
      if (res && res.errCode === 0) {
        toast.success("Thêm phòng khám mới thành công!");
        this.resetForm();
      } else {
        toast.error(res?.errMessage || "Có lỗi xảy ra khi thêm phòng khám");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm phòng khám");
    } finally {
      this.setState({ isSubmitting: false });
    }
  };
  resetForm = () => {
    this.setState({
      name: "",
      address: "",
      imageBase64: "",
      contentHTML: "",
      contentMarkdown: "",
      selectedOption: null, // reset option
      previewImageUrl: "", // reset ảnh
      hasOldData: false, // reset về trạng thái thêm mới
    });

    // Nếu muốn xoá cả file input (tên file ảnh hiển thị), bạn cần clear thủ công:
    if (this.fileInputRef) {
      this.fileInputRef.value = ""; // reset tên file chọn
    }
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    if (selectedOption) {
      console.log("selectedOption", selectedOption);
      let id = selectedOption.value;
      let res = await getAllDetailClinicById({ id, lang: this.props.language });
      console.log("check res ...", res);
      if (res && res.errCode === 0 && res.data) {
        this.setState({
          name: res.data.name,
          address: res.data.address,
          imageBase64: res.data.image,
          contentHTML: res.data.clinicMarkdown.contentHTML,
          contentMarkdown: res.data.clinicMarkdown.contentMarkdown,
          previewImageUrl: res.data.image,
          hasOldData: true,
        });
        console.log("check data", res.data.clinicMarkdown);
      } else {
        // Nếu không có dữ liệu, reset form về trạng thái tạo mới
        this.setState({
          name: "",
          address: "",
          imageBase64: "",
          contentHTML: "",
          contentMarkdown: "",
          hasOldData: false,
          previewImageUrl: "",
        });
      }
    }
  };

  render() {
    let { hasOldData, isSubmitting } = this.state;
    return (
      <div className="manage-clinic-container">
        <div className="container-fluid">
          <div className="text-center mb-4">
            <h3 className="fw-bold">Quản lý phòng khám</h3>
            <p className="text-muted">Thêm phòng khám mới vào hệ thống</p>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.handleSaveNewClinic();
                    }}
                  >
                    {/* Tên phòng khám */}
                    <div className="form-group mb-3">
                      <label className="form-label fw-bold">
                        <i className="fas fa-hospital me-2"></i>
                        Tên phòng khám <span className="text-danger">*</span>
                      </label>

                      {/* Select clinic có sẵn */}
                      <Select
                        value={this.state.selectedOption}
                        onChange={this.handleChangeSelect}
                        options={this.state.arrAllClinic}
                        placeholder="Chọn phòng khám có sẵn..."
                      />

                      {/* Hoặc nhập tên phòng khám mới */}
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Hoặc nhập tên phòng khám mới..."
                        value={this.state.name}
                        onChange={(e) => {
                          this.setState({
                            name: e.target.value,
                          });
                        }}
                      />
                    </div>

                    {/* Địa chỉ */}
                    <div className="form-group mb-3">
                      <label className="form-label fw-bold">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Địa chỉ <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Nhập địa chỉ phòng khám..."
                        value={this.state.address}
                        onChange={(event) =>
                          this.handleOnchangeInput(event, "address")
                        }
                      />
                    </div>
                    {/* Ảnh đại diện */}
                    <div className="form-group mb-3">
                      <label className="form-label fw-bold">
                        <i className="fas fa-image me-2"></i>
                        Ảnh đại diện
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        ref={(ref) => (this.fileInputRef = ref)} // thêm dòng này
                        onChange={this.handleOnchangeImage}
                      />

                      <small className="form-text text-muted">
                        Chọn ảnh đại diện cho phòng khám (JPG, PNG, GIF)
                      </small>
                      {this.state.imageBase64 && (
                        <div
                          className="previewImage"
                          style={{
                            backgroundImage: `url(${this.state.previewImageUrl})`,
                          }}
                          onClick={() => {
                            this.openPreviewImage();
                          }}
                        ></div>
                      )}
                    </div>
                    {/* Mô tả phòng khám */}
                    <div className="form-group mb-3">
                      <label className="form-label fw-bold">
                        <i className="fas fa-edit me-2"></i>
                        Mô tả phòng khám <span className="text-danger">*</span>
                      </label>
                      <MdEditor
                        style={{ height: "300px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                        placeholder="Nhập mô tả phòng khám..."
                      />
                      <small className="form-text text-muted">
                        Sử dụng Markdown để định dạng nội dung.
                      </small>
                    </div>
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.resetForm}
                        disabled={isSubmitting}
                      >
                        <i className="fas fa-undo me-2"></i>
                        Làm mới
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Đang lưu...
                          </>
                        ) : hasOldData ? (
                          <>
                            <i className="fas fa-edit me-2"></i>
                            Cập nhật phòng khám
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Lưu phòng khám
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImageUrl}
            onCloseRequest={() =>
              this.setState({
                isOpen: false,
              })
            }
          />
        )}
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
