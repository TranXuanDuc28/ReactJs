import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginModal from "../Auth/LoginModal";
import ChatNotification from "./ChatNotification";
import ChatArea from "./mainchat/ChatArea";
import Footer from "./mainchat/Footer";
import { patientLogout } from "../../store/actions/patientActions";
import HomeHeader from "../HomePage/HomeHeader";
import "./PatientChat.scss";
import { setSelectedDoctor } from "../../store/actions/chatActions";
import useChatSendMessage from "../../hooks/useChatSendMessage";

const PatientChat = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const patient = useSelector((state) => state.patient.patientInfo);
  const isLoggedInPatient = useSelector((state) => state.patient.isLoggedInPatient);
  const language = useSelector((state) => state.app.language);
  const dispatch = useDispatch();
  const onlineDoctors = useSelector(state => state.onlineDoctors);
  const selectedDoctor = useSelector(state => state.chat.selectedDoctor);
  const messages = useSelector(state => state.chat.messages);
  const isLoading = useSelector(state => state.chat.isLoading);
  const sendMessage = useChatSendMessage();

  useEffect(() => {
    fetch("http://localhost:8080/api/get_all_doctor")
      .then((res) => res.json())
      .then((res) => setAllDoctors(res.data || []))
      .catch(() => setAllDoctors([]));
  }, []);

  // Đồng bộ lại selectedDoctor khi onlineDoctors hoặc selectedDoctor thay đổi (doctor login lại sẽ có socketId mới)
  useEffect(() => {
    if (!selectedDoctor) return;
    const onlineDoctor = onlineDoctors.find(d => d.id === selectedDoctor.id);
    if (onlineDoctor) {
      // Luôn cập nhật lại toàn bộ thông tin doctor online (bao gồm socketId mới nhất)
      if (
        selectedDoctor.socketId !== onlineDoctor.socketId ||
        selectedDoctor.firstName !== onlineDoctor.firstName // phòng trường hợp thông tin doctor thay đổi
      ) {
        dispatch(setSelectedDoctor({ ...onlineDoctor }));
      }
    } else {
      // Nếu doctor offline, xóa socketId để không gửi nhầm
      if (selectedDoctor.socketId) {
        dispatch(setSelectedDoctor({ ...selectedDoctor, socketId: undefined }));
      }
    }
  }, [onlineDoctors, selectedDoctor, dispatch]);

  const handleDoctorSelect = (doctor) => {
    const onlineDoctor = onlineDoctors.find((d) => d.id === doctor.id);
    let doctorWithSocket;
    if (onlineDoctor) {
      doctorWithSocket = { ...onlineDoctor };
    } else {
      doctorWithSocket = { ...doctor };
    }
    dispatch(setSelectedDoctor(doctorWithSocket));
  };

  // Gửi, xóa, loadMore sẽ được thực hiện qua App (hook useChatMessages ở App), chỉ cần dispatch action hoặc gọi API nếu cần
  // Nếu muốn, có thể tạo các action gửi/xóa tin nhắn riêng biệt

  const handleSendMessage = (msg, fileMeta) => {
    if (!isLoggedInPatient) {
      setShowNotification(true);
      return;
    }
    if (!selectedDoctor?.socketId) {
      alert("Bác sĩ hiện không online, bạn không thể gửi tin nhắn realtime.");
      return;
    }
    sendMessage(msg, fileMeta);
  };

  const handleLogout = () => {
    dispatch(patientLogout());
    dispatch(setSelectedDoctor(null));
    setShowLoginModal(false);
    setShowNotification(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  return (
    <div>
      <HomeHeader />
      <div className="container-fluid py-3 px-1 px-md-3">
        <div className="row g-3" style={{ minHeight: '80vh' }}>
          {/* Danh sách bác sĩ */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                <h5 className="mb-0" style={{ fontSize: 18 }}>Danh sách bác sĩ</h5>
                {isLoggedInPatient ? (
                  <button className="btn btn-light btn-sm" onClick={handleLogout} title="Đăng xuất">
                    <i className="fa fa-sign-out"></i>
                  </button>
                ) : (
                  <button className="btn btn-light btn-sm" onClick={() => setShowLoginModal(true)}>
                    <i className="fa fa-sign-in"></i>
                  </button>
                )}
              </div>
              <div className="card-body p-2 overflow-auto" style={{ maxHeight: 600 }}>
                {allDoctors.length === 0 ? (
                  <p className="text-center text-muted">Không có bác sĩ nào</p>
                ) : (
                  allDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`d-flex align-items-center p-2 mb-2 rounded ${selectedDoctor?.id === doctor.id ? "bg-primary text-white" : "bg-light"} doctor-item`}
                      style={{ cursor: 'pointer', border: selectedDoctor?.id === doctor.id ? '2px solid #007bff' : '1px solid #eee' }}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <img src={doctor.image} alt={doctor.firstName} className="rounded-circle me-2" style={{ width: 48, height: 48, objectFit: 'cover', border: '2px solid #eee' }} />
                      <div className="flex-grow-1">
                        <div className="fw-bold">{doctor.firstName} {doctor.lastName}</div>
                        <div className="small text-muted">{doctor.positionData?.valueVi || "Bác sĩ"}</div>
                        {onlineDoctors.some((d) => d.id === doctor.id) && (
                          <span className="badge bg-success mt-1">Online</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Khung chat */}
          <div className="col-12 col-md-8 col-lg-9 d-flex flex-column">
            <div className="card flex-grow-1 shadow-sm d-flex flex-column h-100">
              <div className="card-body d-flex flex-column p-0" style={{ minHeight: 400 }}>
                {!selectedDoctor ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <p className="text-muted">Vui lòng chọn một bác sĩ để bắt đầu chat</p>
                  </div>
                ) : (
                  <>
                    <div className="d-flex align-items-center gap-3 border-bottom px-3 py-2 bg-light">
                      {selectedDoctor.image ? (
                        <img src={selectedDoctor.image} alt={selectedDoctor.firstName} className="rounded-circle" style={{ width: 48, height: 48, objectFit: 'cover', border: '2px solid #eee' }} />
                      ) : (
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontWeight: 700, fontSize: 22 }}>
                          {selectedDoctor.firstName?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <div className="fw-bold" style={{ fontSize: 18 }}>{selectedDoctor.firstName} {selectedDoctor.lastName}</div>
                        <div className="text-muted small">{selectedDoctor.positionData?.valueVi || 'Bác sĩ'}</div>
                        {selectedDoctor.socketId && (
                          <span className="badge bg-success mt-1">Online</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
                      <div className="flex-grow-1 overflow-auto">
                        <ChatArea
                          allMsg={messages}
                          user={patient}
                          // handleDelete, loadMore sẽ được truyền từ App hoặc qua Redux nếu cần
                        />
                      </div>
                      <Footer handleSendMsg={handleSendMessage} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Modal login và thông báo */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {showNotification && (
          <ChatNotification
            onLoginClick={() => {
              setShowNotification(false);
              setShowLoginModal(true);
            }}
            onClose={() => setShowNotification(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientChat;
