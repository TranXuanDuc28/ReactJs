import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import HomeHeader from "../HomePage/HomeHeader";
// Giả sử bạn có service lấy lịch hẹn
import { getPatientAppointments } from "../../services/userServices";
import moment from "moment";

class AppointmentHistory extends Component {
  state = {
    appointments: [],
    loading: true,
    error: "",
  };

  async componentDidMount() {
    const { patientInfo } = this.props;
    if (!patientInfo) return;
    try {
      const res = await getPatientAppointments(patientInfo.id);
      if (res && res.errCode === 0) {
        this.setState({ appointments: res.data, loading: false });
      } else {
        this.setState({
          error: res.errMessage || "Không lấy được dữ liệu",
          loading: false,
        });
      }
    } catch (e) {
      this.setState({ error: "Có lỗi xảy ra", loading: false });
    }
  }

  render() {
    const { isLoggedInPatient, patientInfo } = this.props;
    const { appointments, loading, error } = this.state;

    if (!isLoggedInPatient || !patientInfo) {
      // Nếu chưa đăng nhập, chuyển hướng về trang chủ
      return <Redirect to="/home" />;
    }

    return (
      <div>
        <HomeHeader isShowBanner={false} />
        <div className="container py-4">
          <h2 className="fw-bold mb-4">Lịch sử lịch hẹn của bạn</h2>
          {loading && <div>Đang tải...</div>}
          {error && <div className="text-danger">{error}</div>}
          {!loading && !error && appointments.length === 0 && (
            <div>Bạn chưa có lịch hẹn nào.</div>
          )}
          {!loading && !error && appointments.length > 0 && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Bác sĩ</th>
                  <th>Chuyên khoa</th>
                  <th>Thời gian khám</th>
                  <th>Ngày đặt lịch hẹn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.doctorName}</td>
                    <td>{item.specialty}</td>
                    <td>
                      {moment.unix(+item.time / 1000).format("DD/MM/YYYY")}
                    </td>
                    <td>{item.timeType}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedInPatient: state.patient.isLoggedInPatient,
  patientInfo: state.patient.patientInfo,
});

export default withRouter(connect(mapStateToProps)(AppointmentHistory));
