import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils, CRUD_ACTION, LANGUAGE } from "../../../utils";
import {
  createNewHandBook,
  getAllDetailHandBookById,
  getAllHandBook,
} from "../../../services/userServices";
import { toast } from "react-toastify";
import "./ManageHandbook.scss";
import CreatableSelect from "react-select/creatable";
import Lightbox from "react-image-lightbox";
import Select from "react-select";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageHandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      imageBase64: "",
      contentHTML: "",
      contentMarkdown: "",
      authors: "BookingCare Team",
      reviewers: "",
      published: "",
      updated: "",
      category: "Cẩm nang",
      isSubmitting: false,
      selectedOption: "",
      hasOldData: false,
      previewImageUrl: "",
      isOpen: false,
      arrAllHandBook: [],
    };
  }

  async componentDidMount() {
    // Set default dates
    const today = new Date().toISOString().split("T")[0];
    this.setState({
      published: today,
      updated: today,
    });
    await this.getAllHandBook();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      await this.getAllHandBook();
    }
  }
  getAllHandBook = async (lang) => {
    try {
      let res = await getAllHandBook({ lang: "vi" });
      console.log(" res AllHandBook", res);
      if (res && res.errCode === 0) {
        let dataSelect = this.buildDataInputSelect(res.data, "HANDBOOKS");
        this.setState({
          arrAllHandBook: dataSelect,
        });
        console.log("arrAllHandBook", this.state.arrAllHandBook);
      }
    } catch (error) {
      console.error("Error fetching handbooks:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách cẩm nang");
    }
  };
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let language = this.props.language;
    if (inputData && inputData.length > 0) {
      if (type === "HANDBOOKS") {
        inputData.map((item, index) => {
          let object = {};
          let labelEn = `${item.handbookData[0].title}`;
          let labelVi = `${item.handbookData[0].title}`;
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
        previewImageUrl: URL.createObjectURL(file),
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
    const { title, contentMarkdown, authors, category } = this.state;

    // if (!title.trim()) {
    //   toast.error("Vui lòng nhập tiêu đề cẩm nang");
    //   return false;
    // }

    if (!contentMarkdown) {
      toast.error("Vui lòng nhập nội dung cẩm nang");
      return false;
    }

    if (!authors) {
      toast.error("Vui lòng nhập tác giả");
      return false;
    }

    if (!category) {
      toast.error("Vui lòng chọn danh mục");
      return false;
    }

    return true;
  };

  handleSaveNewHandBook = async () => {
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true });
    let { hasOldData } = this.state;

    try {
      // Prepare data with new fields
      const handbookData = {
        lang: this.props.language,
        handbookId: this.state.selectedOption.value,
        title: this.state.title,
        imageBase64: this.state.imageBase64,
        contentHTML: this.state.contentHTML,
        contentMarkdown: this.state.contentMarkdown,
        authors: this.state.authors
          ? this.state.authors.split(",").map((a) => a.trim())
          : [],
        reviewers: this.state.reviewers
          ? this.state.reviewers.split(",").map((r) => r.trim())
          : [],
        published: this.state.published,
        updated: this.state.updated,
        category: this.state.category,
        action: hasOldData === true ? CRUD_ACTION.UPDATE : CRUD_ACTION.CREATE,
      };

      let res = await createNewHandBook(handbookData);

      if (res && res.errCode === 0) {
        toast.success("Thêm cẩm nang mới thành công!");
        this.resetForm();
      } else {
        toast.error(res?.errMessage || "Có lỗi xảy ra khi thêm cẩm nang");
      }
    } catch (error) {
      console.error("Error creating handbook:", error);
      toast.error("Có lỗi xảy ra khi thêm cẩm nang");
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  resetForm = () => {
    const today = new Date().toISOString().split("T")[0];
    this.setState({
      title: "",
      imageBase64: "",
      contentHTML: "",
      contentMarkdown: "",
      authors: "BookingCare Team",
      reviewers: "",
      published: today,
      updated: today,
      category: "Cẩm nang",
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
      let lang = this.props.language;
      let res = await getAllDetailHandBookById({ id, lang });
      console.log("get handbook detal by id", res);
      if (res && res.errCode === 0 && res.data) {
        this.setState({
          title: res.data.handbookData.title,
          imageBase64: res.data.image,
          contentHTML: res.data.handbookMarkdown.contentHTML,
          contentMarkdown: res.data.handbookMarkdown.contentMarkdown,
          authors: Array.isArray(res.data.authors)
            ? res.data.authors.join(", ")
            : res.data.authors || "",
          reviewers: Array.isArray(res.data.reviewers)
            ? res.data.reviewers.join(", ")
            : res.data.reviewers || "",
          published: res.data.published,
          updated: res.data.updated,
          category: "Cẩm nang",
          previewImageUrl: res.data.image,
          hasOldData: true,
        });
      } else {
        // Nếu không có dữ liệu, reset form về trạng thái tạo mới
        const today = new Date().toISOString().split("T")[0];
        this.setState({
          title: "",
          address: "",
          imageBase64: "",
          contentHTML: "",
          contentMarkdown: "",
          authors: "",
          reviewers: "",
          published: today,
          updated: today,
          category: "Cẩm nang",
          selectedOption: null, // reset option
          hasOldData: false,
          previewImageUrl: "",
        });
      }
    }
  };

  render() {
    let { isSubmitting, hasOldData } = this.state;
    console.log("state", this.state);

    return (
      <div className="manage-handbook-container">
        <div className="container-fluid">
          <div className="text-center mb-4">
            <h3 className="fw-bold">Quản lý cẩm nang</h3>
            <p className="text-muted">Thêm cẩm nang mới vào hệ thống</p>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.handleSaveNewHandBook();
                    }}
                  >
                    {/* Basic Information */}
                    <div className="row mb-4">
                      <div className="col-md-8">
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-heading me-2"></i>
                            Tiêu đề cẩm nang{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.arrAllHandBook}
                            placeholder="Chọn cẩm nang có sẵn..."
                          />
                          <input
                            className="form-control mt-2"
                            type="text"
                            placeholder="Nhập tên cẩm nang..."
                            value={this.state.title}
                            onChange={(event) =>
                              this.handleOnchangeInput(event, "title")
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-tag me-2"></i>
                            Danh mục <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            value={this.state.category}
                            onChange={(event) =>
                              this.handleOnchangeInput(event, "category")
                            }
                          >
                            <option value="Cẩm nang">Cẩm nang</option>
                            <option value="Sức khỏe">Sức khỏe</option>
                            <option value="Dinh dưỡng">Dinh dưỡng</option>
                            <option value="Thể thao">Thể thao</option>
                            <option value="Tâm lý">Tâm lý</option>
                            <option value="Bệnh lý">Bệnh lý</option>
                            <option value="Thuốc">Thuốc</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Authors and Reviewers */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-user-edit me-2"></i>
                            Tác giả <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Nhập tên tác giả..."
                            value={this.state.authors}
                            onChange={(event) =>
                              this.handleOnchangeInput(event, "authors")
                            }
                          />
                          <small className="form-text text-muted">
                            Có thể nhập nhiều tác giả, phân cách bằng dấu phẩy
                          </small>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-user-check me-2"></i>
                            Người kiểm duyệt
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Nhập tên người kiểm duyệt..."
                            value={this.state.reviewers}
                            onChange={(event) =>
                              this.handleOnchangeInput(event, "reviewers")
                            }
                          />
                          <small className="form-text text-muted">
                            Có thể nhập nhiều người, phân cách bằng dấu phẩy
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-calendar-plus me-2"></i>
                            Ngày xuất bản
                          </label>
                          <input
                            className="form-control"
                            type="date"
                            value={this.state.published}
                            onChange={(event) =>
                              this.handleOnchangeInput(event, "published")
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-calendar-check me-2"></i>
                            Ngày cập nhật cuối
                          </label>
                          <input
                            className="form-control"
                            type="date"
                            value={this.state.updated}
                            onChange={(event) =>
                              this.handleOnchangeInput(event, "updated")
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-image me-2"></i>
                            Ảnh đại diện
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            accept="image/*"
                            ref={(ref) => (this.fileInputRef = ref)}
                            onChange={(event) =>
                              this.handleOnchangeImage(event)
                            }
                          />
                          <small className="form-text text-muted">
                            Chọn ảnh đại diện cho cẩm nang (JPG, PNG, GIF)
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
                      </div>
                    </div>

                    {/* Table of Contents */}

                    {/* Content Editor */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="form-group mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-edit me-2"></i>
                            Nội dung cẩm nang{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <MdEditor
                            style={{ height: "400px" }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                            placeholder="Nhập nội dung cẩm nang..."
                          />
                          <small className="form-text text-muted">
                            Sử dụng Markdown để định dạng nội dung. Hỗ trợ tiêu
                            đề, danh sách, bảng, hình ảnh, v.v.
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="row">
                      <div className="col-12">
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
                                Cập nhật cẩm nang
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>
                                Lưu cẩm nang
                              </>
                            )}
                          </button>
                        </div>
                      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandBook);
