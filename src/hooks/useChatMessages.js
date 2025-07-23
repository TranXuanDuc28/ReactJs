import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getSocket } from "../socket";

const PATH = "http://localhost:8080";

export default function useChatMessages({ user, receiver }) {
  const socketRef = useRef();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  // Kết nối socket (singleton)
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    if (!socket.connected) socket.connect();
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    return () => {
      // KHÔNG disconnect ở đây, chỉ disconnect khi logout toàn app
    };
  }, []);

  // Lắng nghe tin nhắn mới, luôn clear listener cũ trước khi gán mới
  useEffect(() => {
    const socket = socketRef.current;
    if (isConnected && user) {
      socket.emit("ADD_USER", user);
      // Clear listener cũ trước khi gán mới
      socket.off("RECEIVED_MSG");
      socket.on("RECEIVED_MSG", (data) => {
        const msg = data.data ? data.data : data;

        setMessages((prevState) => [...prevState, msg]);
      });
    }
    // Cleanup khi unmount
    return () => {
      if (socket) {
        socket.off("RECEIVED_MSG");
      }
    };
  }, [isConnected, user, receiver]);

  // Load tin nhắn khi receiver/user thay đổi
  useEffect(() => {
    if (receiver && user) {
      loadMessages(receiver.id);
    }
    // eslint-disable-next-line
  }, [receiver, user]);

  const loadMessages = (receiverId, offsetVal = 0) => {
    if (!user) return;
    setIsLoading(true);
    axios
      .get(
        `http://localhost:8080/api/get-msg/${receiverId}?userId=${user.id}&offset=${offsetVal}`
      )
      .then((res) => {
        if (offsetVal > 0) {
          setMessages((prev) => [...res.data.data, ...prev]);
        } else {
          setMessages(res.data.data || []);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  // Bổ sung optimistic update khi gửi tin nhắn
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
      console.log("123", data);
      socket.emit("SEND_MSG", data);
    }
  };

  const deleteMessage = (msgId) => {
    axios
      .post(`http://localhost:8080/api/del-msg/${msgId}`)
      .then(() => {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
      })
      .catch(() => {});
  };

  const loadMore = () => {
    if (!receiver) return;
    const newOffset = messages.length;
    setOffset(newOffset);
    loadMessages(receiver.id, newOffset);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    deleteMessage,
    loadMore,
    setMessages,
  };
}
