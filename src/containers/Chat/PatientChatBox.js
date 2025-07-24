import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoginModal from "../Auth/LoginModal";
import ChatNotification from "./ChatNotification";
import ChatArea from "./mainchat/ChatArea";
import Footer from "./mainchat/Footer";
import useChatMessages from "../../hooks/useChatMessages";
import "./PatientChat.scss";
import { setSelectedDoctor } from "../../store/actions/chatActions";

const PatientChatBox = ({ doctor, onClose }) => {
  const patient = useSelector((state) => state.patient.patientInfo);
  const isLoggedInPatient = useSelector((state) => state.patient.isLoggedInPatient);
  const onlineDoctors = useSelector(state => state.onlineDoctors);
  const dispatch = useDispatch();
  const selectedDoctor = useSelector(state => state.chat.selectedDoctor);

  // Khi mount, set selectedDoctor là doctor truyền vào
  useEffect(() => {
    if (doctor) {
      const onlineDoctor = onlineDoctors.find((d) => d.id === doctor.id);
      if (onlineDoctor) {
        dispatch(setSelectedDoctor({ ...doctor, socketId: onlineDoctor.socketId }));
      } else {
        dispatch(setSelectedDoctor(doctor));
      }
    }
    // Khi unmount, clear selectedDoctor nếu muốn (tùy logic app)
    // return () => dispatch(setSelectedDoctor(null));
    // eslint-disable-next-line
  }, [doctor, onlineDoctors, dispatch]);

  useChatMessages({ user: patient, receiver: selectedDoctor });

  const messages = useSelector(state => state.chat.messages);
  const isLoading = useSelector(state => state.chat.isLoading);

  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const [previewImg, setPreviewImg] = React.useState(null);

  const { sendMessage, deleteMessage, loadMore } = useChatMessages({ user: patient, receiver: selectedDoctor });

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

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="card shadow-lg position-fixed" style={{ bottom: 24, right: 24, width: 370, maxWidth: '95vw', zIndex: 9999, borderRadius: 16, minHeight: 480, maxHeight: '80vh', overflow: 'hidden' }}>
      {/* Header */}
      <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-center gap-2">
          {doctor?.image ? (
            <img src={doctor.image} alt={doctor.firstName} className="rounded-circle" style={{ width: 40, height: 40, objectFit: 'cover', border: '2px solid #fff' }} />
          ) : (
            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontWeight: 700, fontSize: 20 }}>
              {doctor?.firstName?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <div className="fw-bold" style={{ fontSize: 16 }}>{doctor?.firstName} {doctor?.lastName}</div>
            <div className="small text-light">{doctor?.positionData?.valueVi || 'Bác sĩ'}</div>
            {selectedDoctor?.socketId && (
              <span className="badge bg-success mt-1">Online</span>
            )}
          </div>
        </div>
        <button onClick={onClose} className="btn btn-light btn-sm ms-2" title="Đóng"><i className="fa fa-times"></i></button>
      </div>
      {/* Chat messages */}
      <div className="card-body d-flex flex-column p-0 bg-light" style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto' }}>
        <ChatArea
          allMsg={messages}
          user={patient}
          handleDelete={deleteMessage}
          loadMoreMsg={loadMore}
        />
      </div>
      {/* Footer nhập tin nhắn */}
      <div className="card-footer bg-white p-2">
        <Footer handleSendMsg={handleSendMessage} />
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
  );
};

export default PatientChatBox;