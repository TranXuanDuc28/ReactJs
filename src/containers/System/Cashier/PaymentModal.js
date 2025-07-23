import React, { Component } from "react";
import { connect } from "react-redux";
import "./PaymentModal.scss";
import { FormattedMessage } from "react-intl";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import { CommonUtils } from "../../../utils";
import Select from "react-select";
import { getAllMedicines } from "../../../services/userServices";
import * as actions from "../../../store/actions";
class PaymentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      cashier: "",
      date: new Date().getTime(),
      totalPrice: 0,
      description: "",
    };
  }
  async componentDidMount() {
    if (this.props.dataModal && !_.isEmpty(this.props.dataModal)) {
      let { dataModal, user } = this.props;
      this.setState({
        email: dataModal.email ? dataModal.email : "",
        cashier: user.firstName + " " + user.lastName,
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
  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };
  handleConfirmPayment = () => {
    // Truyền thêm danh sách thuốc đã chọn và tổng giá
    this.props.handleSendPayment({
      ...this.state,
    });
  };

  render() {
    let { isOpenModal, closePaymentModal, dataModal, handleSendPayment } =
      this.props;

    return (
      <Modal
      show={isOpenModal}
      onHide={closePaymentModal}
        className={"modal-booking-container"}
        size="lg"
        centered
      >
        <div className="modal-booking-content">
          <div className="modal-booking-header">
            <span className="left">Thông tin giao dịch thanh toán</span>
            <span className="right">
              <i className="fas fa-times" onClick={closePaymentModal}></i>
            </span>
          </div>
          <div className="modal-booking-body">
            <div className="row">
              <div className="col-6 form-group">
                <label>Email bệnh nhân</label>
                <input
                  className="form-control"
                  value={this.state.email}
                  onChange={(event) => this.handleOnchangeInput(event, "email")}
                />
              </div>
              <div className="col-6 form-group">
                <label>Người thu tiền</label>
                <input
                  className="form-control"
                  value={this.state.cashier}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "cashier")
                  }
                />
              </div>
              <div className="col-6 form-group">
                <label>Ngày thu</label>
                <input className="form-control" value={this.state.date} />
              </div>
              <div className="col-6 form-group">
                <label>Số tiền</label>
                <input
                  className="form-control"
                  value={this.state.totalPrice}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "totalPrice")
                  }
                />
              </div>
              <div className="col-6 form-group">
                <label>Nội dung thu</label>
                <input
                  className="form-control"
                  value={this.state.description}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "description")
                  }
                />
              </div>
            </div>
          </div>
          <div className="modal-booking-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleConfirmPayment()}
            >
              <FormattedMessage id="patient.booking-modal.btnConfirm" />
            </button>
            <button className="btn-booking-cancel" onClick={closePaymentModal}>
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
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDoctor: () => dispatch(actions.getAllDoctor()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentModal);
