import React, { Component } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { FormattedMessage } from "react-intl";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import { CommonUtils } from "../../../utils";
import Select from "react-select";
import { getAllMedicines } from "../../../services/userServices";
class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imagebase64: "",
      medicines: [], // danh sách thuốc lấy từ API
      selectedMedicines: [], // thuốc đã chọn
      totalPrice: 0, // tổng giá thuốc đã chọn
    };
  }
  async componentDidMount() {
    if (this.props.dataModal && !_.isEmpty(this.props.dataModal)) {
      let { dataModal } = this.props;
      this.setState({
        email: dataModal.email ? dataModal.email : "",
      });
    }
    // Lấy danh sách thuốc từ API
    let res = await getAllMedicines();
    console.log("res", res);
    if (res && res.data && res.errCode === 0) {
      console.log("res 123");
      let options = res.data.map((item) => ({
        value: item.id,
        label: item.name,
        price: item.price, // lưu cả giá thuốc
      }));

      this.setState({ medicines: options });
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.dataModal !== prevProps.dataModal) {
      if (this.props.dataModal && !_.isEmpty(this.props.dataModal)) {
        let { dataModal } = this.props;
        this.setState({
          email: dataModal.email ? dataModal.email : "",
        });
      }
    }
  }
  handleOnChangeMail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };
  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imagebase64: base64,
      });
    } else {
      this.setState({
        imagebase64: "",
      });
    }
  };
  handleMedicineChange = (selectedOptions) => {
    const totalPrice = (selectedOptions || []).reduce((sum, med) => sum + (med.price || 0), 0);
    this.setState({ selectedMedicines: selectedOptions, totalPrice });
  };
  handleSendRemedy = () => {
    // Truyền thêm danh sách thuốc đã chọn và tổng giá
    this.props.sendRemedy({
      ...this.state,
      selectedMedicines: this.state.selectedMedicines,
      totalPrice: this.state.totalPrice,
    });
  };

  render() {
    let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;

    return (
      <Modal
        show={isOpenModal}
        onHide={closeRemedyModal}
        className={"modal-booking-container"}
        size="lg"
        centered
      >
        <div className="modal-booking-content">
          <div className="modal-booking-header">
            <span className="left">Thông tin đặt lịch khám bệnh</span>
            <span className="right">
              <i className="fas fa-times" onClick={closeRemedyModal}></i>
            </span>
          </div>
          <div className="modal-booking-body">
            <div className="row">
              <div className="col-6 form-group">
                <label>Email</label>
                <input
                  className="form-control"
                  value={this.state.email}
                  onChange={(event) => this.handleOnChangeMail(event)}
                />
              </div>
              <div className="col-6 form-group">
                <label>Ảnh đơn thuốc</label>
                <input
                  className="form-control-file"
                  type="file"
                  onChange={(event) => this.handleOnchangeImage(event)}
                />
              </div>
              <div className="col-12 form-group mt-3">
                <label>Đơn thuốc</label>
                <Select
                  isMulti
                  value={this.state.selectedMedicines}
                  onChange={this.handleMedicineChange}
                  options={this.state.medicines}
                  placeholder="Chọn thuốc..."
                />
                <div style={{ marginTop: 10, fontWeight: 'bold' }}>
                  Tổng giá: {this.state.totalPrice.toLocaleString()} VNĐ
                </div>
              </div>
            </div>
          </div>
          <div className="modal-booking-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleSendRemedy()}
            >
              <FormattedMessage id="patient.booking-modal.btnConfirm" />
            </button>
            <button className="btn-booking-cancel" onClick={closeRemedyModal}>
              <FormattedMessage id="patient.booking-modal.btnCancel" />
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
