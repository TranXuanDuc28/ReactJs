import React, { Component } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import _ from "lodash";
import { CommonUtils } from "../../../utils";
class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imagebase64: "",
    };
  }
  async componentDidMount() {
    if (this.props.dataModal && !_.isEmpty(this.props.dataModal)) {
      let { dataModal } = this.props;
      this.setState({
        email: dataModal.email ? dataModal.email : "",
      });
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
  handleSendRemedy = () => {
    this.props.sendRemedy(this.state);
  };

  render() {
    let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;
    return (
      <Modal
        isOpen={isOpenModal}
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
