import React, { Component, Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";

import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";

import { path } from "../utils";

import Home from "../routes/Home";
import HomePage from "../containers/HomePage/HomePage";
// import Login from '../routes/Login';
import Login from "./Auth/Login";
import Header from "./Header/Header";
import System from "../routes/System";
import DetailDoctors from "./Patient/Doctor/DetailDoctors";
import Doctor from "../routes/Doctor";
import CustomScrollbars from "../components/CustomScrollbars";
import VerifyEmail from "./Patient/VerifyEmail";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";
import PatientChat from "./Chat/PatientChat";
import { useSelector } from "react-redux";
import { getSocket } from "../socket";
import { setOnlineDoctors } from "../store/actions/onlineDoctorsActions";
import useChatMessages from "../hooks/useChatMessages";

// Hook emit ADD_USER khi patient login thành công
function useRegisterPatientSocket() {
  const patient = useSelector(state => state.patient.patientInfo);
  React.useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    const handleConnect = () => {
      if (patient) {
        socket.emit("ADD_USER", patient);
      }
    };
    socket.on("connect", handleConnect);
    // Nếu đã connect sẵn thì emit luôn
    if (socket.connected && patient) {
      socket.emit("ADD_USER", patient);
    }
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [patient]);
}

// Hook lắng nghe USER_ADDED và cập nhật redux onlineDoctors
function useListenOnlineDoctors() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const socket = getSocket();
    const handleUserAdded = (users) => {
      dispatch(setOnlineDoctors(users.filter(u => u.roleId === "R2")));
    };
    socket.on("USER_ADDED", handleUserAdded);
    return () => {
      socket.off("USER_ADDED", handleUserAdded);
    };
  }, [dispatch]);
}

// Hook lắng nghe và quản lý chat socket toàn cục
function useGlobalChatSocket() {
  const patient = useSelector(state => state.patient.patientInfo);
  const selectedDoctor = useSelector(state => state.chat.selectedDoctor);
  useChatMessages({ user: patient, receiver: selectedDoctor });
}

// Bọc App class bằng function component để dùng hook
function AppWithSocket(props) {
  useRegisterPatientSocket();
  useListenOnlineDoctors();
  useGlobalChatSocket(); // chỉ mount 1 lần duy nhất
  return <App {...props} />;
}

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <span className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />
                  <Route
                    path={"/doctor/"}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctors} />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                  <Route
                    path={path.VERIFY_EMAIL_BOOKING}
                    component={VerifyEmail}
                  />
                  <Route
                    path={path.CHAT_PATIENT}
                    component={PatientChat}
                  />
                </Switch>
              </CustomScrollbars>
            </span>

            {/* <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        /> */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
    isLoggedInPatient: state.patient.isLoggedInPatient,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWithSocket);
