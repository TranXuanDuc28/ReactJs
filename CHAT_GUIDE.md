# Hướng dẫn sử dụng tính năng Chat

## Tổng quan
Tính năng chat cho phép bệnh nhân (patient) chat với bác sĩ trực tuyến. Bệnh nhân có thể xem danh sách bác sĩ online và bắt đầu cuộc trò chuyện.

## Cách sử dụng

### 1. Truy cập Chat
- Từ trang chủ, click vào nút "Chat với Bác sĩ" trên header
- Hoặc truy cập trực tiếp: `/chat-patient`

### 2. Xem danh sách bác sĩ
- Danh sách bác sĩ online sẽ hiển thị ở bên trái
- Mỗi bác sĩ sẽ hiển thị:
  - Avatar
  - Tên bác sĩ
  - Chuyên khoa

### 3. Bắt đầu chat
- Click vào một bác sĩ để chọn
- Nếu chưa đăng nhập, hệ thống sẽ yêu cầu đăng nhập
- Sau khi đăng nhập, có thể gửi tin nhắn

### 4. Gửi tin nhắn
- Nhập tin nhắn vào ô input
- Nhấn Enter hoặc click nút "Gửi"
- Tin nhắn sẽ hiển thị theo thời gian thực

## Tính năng

### Cho bệnh nhân chưa đăng nhập:
- Xem danh sách bác sĩ online
- Thông báo yêu cầu đăng nhập khi muốn chat
- Modal đăng nhập nhanh

### Cho bệnh nhân đã đăng nhập:
- Chat real-time với bác sĩ
- Xem lịch sử tin nhắn
- Gửi tin nhắn mới

## Cấu trúc file

```
src/containers/Chat/
├── PatientChat.js          # Component chính cho patient chat
├── PatientChat.scss        # Style cho patient chat
├── ChatNotification.js     # Thông báo khi chưa đăng nhập
├── ChatNotification.scss   # Style cho notification
└── index.js               # Chat cho admin (đã có sẵn)

src/containers/Auth/
├── LoginModal.js          # Modal đăng nhập nhanh
└── LoginModal.scss        # Style cho login modal
```

## API Endpoints

### Backend cần hỗ trợ:
- `GET /api/get-msg/:doctorId?userId=:userId` - Lấy tin nhắn
- `POST /api/del-msg/:id` - Xóa tin nhắn
- Socket events:
  - `ADD_USER` - Thêm user vào danh sách online
  - `USER_ADDED` - Nhận danh sách user online
  - `SEND_MSG` - Gửi tin nhắn
  - `RECEIVED_MSG` - Nhận tin nhắn mới
  - `DELETE_MSG` - Xóa tin nhắn

## Lưu ý

1. **Bảo mật**: Chỉ bệnh nhân đã đăng nhập mới có thể chat
2. **Real-time**: Sử dụng Socket.IO để chat real-time
3. **Responsive**: Giao diện tương thích mobile
4. **UX**: Thông báo rõ ràng khi cần đăng nhập

## Cách test

1. Chạy server backend với Socket.IO
2. Mở ứng dụng React
3. Truy cập `/chat-patient`
4. Test các trường hợp:
   - Chưa đăng nhập
   - Đã đăng nhập
   - Chat với bác sĩ
   - Responsive trên mobile 