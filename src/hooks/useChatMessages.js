import { useEffect, useRef } from "react";
import axios from "axios";
import { getSocket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatMessages,
  addChatMessage,
  deleteChatMessage,
  setChatLoading,
  setSelectedDoctor,
} from "../store/actions/chatActions";

const PATH = "http://localhost:8080";

export default function useChatMessages({ user, receiver }) {
  const socketRef = useRef();
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const isLoading = useSelector((state) => state.chat.isLoading);
  // selectedDoctor sẽ được quản lý ở component cha hoặc qua Redux nếu muốn đồng bộ toàn app

  // Kết nối socket (singleton)
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    if (!socket.connected) socket.connect();
    // Không cần setIsConnected, chỉ cần biết socket đã connect
    return () => {
      // KHÔNG disconnect ở đây, chỉ disconnect khi logout toàn app
    };
  }, []);

  // Lắng nghe tin nhắn mới, luôn clear listener cũ trước khi gán mới
  useEffect(() => {
    const socket = socketRef.current;
    if (socket.connected && user) {
      socket.emit("ADD_USER", user);
      // Clear listener cũ trước khi gán mới
      socket.off("RECEIVED_MSG");
      socket.on("RECEIVED_MSG", (data) => {
        const msg = data.data ? data.data : data;
        dispatch(addChatMessage(msg));
      });
    }
    // Cleanup khi unmount
    return () => {
      if (socket) {
        socket.off("RECEIVED_MSG");
      }
    };
  }, [user, receiver, dispatch]);

  // Load tin nhắn khi receiver/user thay đổi
  useEffect(() => {
    if (receiver && user) {
      loadMessages(receiver.id);
    } else {
      dispatch(setChatMessages([]));
    }
    // eslint-disable-next-line
  }, [receiver, user, dispatch]);

  const loadMessages = (receiverId, offsetVal = 0) => {
    if (!user) return;
    dispatch(setChatLoading(true));
    axios
      .get(
        `${PATH}/api/get-msg/${receiverId}?userId=${user.id}&offset=${offsetVal}`
      )
      .then((res) => {
        if (offsetVal > 0) {
          // prepend messages
          dispatch(setChatMessages([...res.data.data, ...messages]));
        } else {
          dispatch(setChatMessages(res.data.data || []));
        }
      })
      .catch(() => {})
      .finally(() => dispatch(setChatLoading(false)));
  };

  // Gửi tin nhắn
  const sendMessage = (messageInput, fileMeta) => {
    if (!receiver) return;
    const socket = socketRef.current;
    if (socket.connected) {
      let sender = { ...user, socketId: socket.id };
      const data = {
        msg: messageInput,
        receiver,
        sender,
        ...fileMeta,
      };
      socket.emit("SEND_MSG", data);
      // Có thể optimistic update nếu muốn
      // dispatch(addChatMessage({ ...data, id: Date.now(), createdAt: new Date() }));
    }
  };

  const handleDeleteMessage = (msgId) => {
    axios
      .post(`${PATH}/api/del-msg/${msgId}`)
      .then(() => {
        dispatch(deleteChatMessage(msgId));
      })
      .catch(() => {});
  };

  const loadMore = () => {
    if (!receiver) return;
    const offset = messages.length;
    loadMessages(receiver.id, offset);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    deleteMessage: handleDeleteMessage,
    loadMore,
    setMessages: (msgs) => dispatch(setChatMessages(msgs)),
  };
}
