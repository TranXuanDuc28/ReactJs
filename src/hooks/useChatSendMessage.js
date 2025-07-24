import { getSocket } from "../socket";
import { useSelector } from "react-redux";

export default function useChatSendMessage() {
  const user = useSelector(state => state.patient.patientInfo);
  const receiver = useSelector(state => state.chat.selectedDoctor);

  const sendMessage = (messageInput, fileMeta) => {
    if (!receiver) return;
    const socket = getSocket();
    if (socket.connected) {
      let sender = { ...user, socketId: socket.id };
      const data = {
        msg: messageInput,
        receiver,
        sender,
        ...fileMeta,
      };
      socket.emit("SEND_MSG", data);
    }
  };

  return sendMessage;
} 