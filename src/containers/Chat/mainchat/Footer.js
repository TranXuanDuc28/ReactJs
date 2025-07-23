import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import axios from '../../../axios';

const Footer = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setMsg(e.target.value);
  };
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };
  const handleSumit = async (e) => {
    e.preventDefault();
    // Gửi text nếu có
    if (msg) {
      handleSendMsg(msg, null);
    }
    // Gửi từng file là 1 message riêng
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post('/api/upload-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.errCode === 0) {
          const fileMeta = {
            file_url: res.file_url,
            file_type: res.file_type,
            file_name: res.file_name,
          };
          handleSendMsg('', fileMeta);
        }
      } catch (err) {
        alert('Upload file thất bại!');
      }
    }
    setMsg("");
    setFiles([]);
    setShowEmoji(false);
  };
  const handleEmojiClick = (emojiData) => {
    setMsg((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="p-2 border-top position-relative bg-white">
      {/* Hiển thị tên file đã chọn */}
      {files.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {files.map((file, idx) => (
            <div key={idx} style={{
              background: '#f5f5f5',
              borderRadius: 6,
              padding: '6px 12px',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 14,
              color: '#007bff',
              fontWeight: 500,
              marginRight: 8,
              marginBottom: 4
            }}>
              <i className="fa fa-paperclip" style={{ marginRight: 8 }} />
              {file.name}
              <button
                type="button"
                style={{
                  marginLeft: 12,
                  border: 'none',
                  background: 'transparent',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: 16
                }}
                onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                title="Xóa file"
              >
                <i className="fa fa-times" />
              </button>
            </div>
          ))}
        </div>
      )}
      <form className="d-flex align-items-center" onSubmit={handleSumit}>
        <input
          type="file"
          multiple
          style={{ display: 'none' }}
          id="chat-file-input"
          onChange={handleFileChange}
        />
        <label htmlFor="chat-file-input" className="btn btn-link p-0 mr-2" tabIndex={-1} title="Gửi file/ảnh">
          <i className="fa fa-paperclip" />
        </label>
        <button type="button" className="btn btn-link p-0 mr-2" onClick={() => setShowEmoji((prev) => !prev)}>
          <i className="fa fa-smile" />
        </button>
        {showEmoji && (
          <div style={{ position: "absolute", bottom: 50, left: 50, zIndex: 10 }}>
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
          </div>
        )}
        <div className="input-group flex-grow-1">
          <input
            type="text"
            className="form-control"
            placeholder="Type your msg and hit"
            value={msg}
            onChange={handleChange}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-outline-primary ml-3 mr-3">
            <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Footer;
