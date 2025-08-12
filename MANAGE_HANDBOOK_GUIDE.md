# Hướng dẫn Quản lý Cẩm nang (ManageHandbook)

## Tổng quan

File `ManageHandbook.js` đã được cải tiến để hỗ trợ đầy đủ các trường mới của model `HandBook` và cung cấp trải nghiệm người dùng tốt hơn.

## Các tính năng mới

### 1. **Trường dữ liệu mới**
- **authors**: Tác giả bài viết (bắt buộc)
- **reviewers**: Người kiểm duyệt (tùy chọn)
- **published**: Ngày xuất bản
- **updated**: Ngày cập nhật cuối
- **toc**: Mục lục (Table of Contents)
- **category**: Danh mục (bắt buộc)

### 2. **Giao diện người dùng cải tiến**
- **Layout hiện đại**: Sử dụng Bootstrap card và responsive design
- **Form validation**: Kiểm tra dữ liệu trước khi gửi
- **Loading states**: Hiển thị trạng thái đang xử lý
- **Icons**: Sử dụng Font Awesome icons cho trực quan
- **Tooltips**: Hướng dẫn người dùng

### 3. **Tính năng nâng cao**
- **Auto-dates**: Tự động set ngày hiện tại cho published và updated
- **Category selection**: Dropdown với các danh mục phổ biến
- **Reset form**: Nút làm mới form
- **Error handling**: Xử lý lỗi chi tiết
- **Success feedback**: Thông báo thành công

## Cấu trúc file

### Frontend Files
```
ReactJs/src/containers/System/HandBook/
├── ManageHandbook.js          # Component chính
└── ManageHandbook.scss        # Styling
```

### Backend Files (đã cập nhật)
```
NodeJs/src/
├── services/handbookServices.js    # Business logic
├── models/handbook.js             # Database model
├── controllers/handbookController.js # API controllers
└── migrations/                    # Database migrations
```

## Chi tiết các thay đổi

### 1. ManageHandbook.js

#### State mới
```javascript
this.state = {
  title: "",
  imageBase64: "",
  contentHTML: "",
  contentMarkdown: "",
  authors: "BookingCare Team",        // Mới
  reviewers: "",                      // Mới
  published: "",                      // Mới
  updated: "",                        // Mới
  toc: "",                           // Mới
  category: "Cẩm nang",              // Mới
  isSubmitting: false                 // Mới
};
```

#### Validation
```javascript
validateForm = () => {
  const { title, contentMarkdown, authors, category } = this.state;
  
  if (!title.trim()) {
    toast.error("Vui lòng nhập tiêu đề cẩm nang");
    return false;
  }
  // ... các validation khác
};
```

#### Form submission
```javascript
const handbookData = {
  title: this.state.title,
  imageBase64: this.state.imageBase64,
  contentHTML: this.state.contentHTML,
  contentMarkdown: this.state.contentMarkdown,
  authors: this.state.authors,
  reviewers: this.state.reviewers,
  published: this.state.published,
  updated: this.state.updated,
  toc: this.state.toc,
  category: this.state.category
};
```

### 2. ManageHandbook.scss

#### Features
- **Modern design**: Card-based layout với shadow effects
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions và hover effects
- **Custom styling**: Cho form controls, buttons, và markdown editor
- **Accessibility**: Focus states và keyboard navigation

#### Key styles
```scss
.manage-handbook-container {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
  
  .card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
    }
  }
}
```

## API Endpoints

### Create Handbook
```
POST /api/create-new-handbook
```

**Request Body:**
```json
{
  "title": "Tiêu đề cẩm nang",
  "imageBase64": "base64_encoded_image",
  "contentHTML": "<p>Nội dung HTML</p>",
  "contentMarkdown": "# Tiêu đề\nNội dung markdown",
  "authors": "Tác giả 1, Tác giả 2",
  "reviewers": "Người kiểm duyệt 1, Người kiểm duyệt 2",
  "published": "2024-01-15",
  "updated": "2024-01-15",
  "toc": "Mục lục tùy chọn",
  "category": "Sức khỏe"
}
```

**Response:**
```json
{
  "errCode": 0,
  "errMessage": "ok"
}
```

## Database Schema

### HandBooks Table
```sql
CREATE TABLE HandBooks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  contentHTML TEXT,
  contentMarkdown TEXT,
  image TEXT,
  authors TEXT DEFAULT 'BookingCare Team',
  reviewers TEXT,
  published DATE,
  updated DATE,
  views INT DEFAULT 0,
  toc TEXT,
  category VARCHAR(100) DEFAULT 'Cẩm nang',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Hướng dẫn sử dụng

### 1. Tạo cẩm nang mới
1. Điền **tiêu đề** (bắt buộc)
2. Chọn **danh mục** (bắt buộc)
3. Nhập **tác giả** (bắt buộc)
4. Nhập **người kiểm duyệt** (tùy chọn)
5. Chọn **ngày xuất bản** và **ngày cập nhật**
6. Upload **ảnh đại diện** (tùy chọn)
7. Nhập **mục lục** (tùy chọn)
8. Viết **nội dung** bằng Markdown (bắt buộc)
9. Nhấn **"Lưu cẩm nang"**

### 2. Validation Rules
- **Tiêu đề**: Không được để trống
- **Nội dung**: Không được để trống
- **Tác giả**: Không được để trống
- **Danh mục**: Phải chọn một danh mục

### 3. Categories Available
- Cẩm nang
- Sức khỏe
- Dinh dưỡng
- Thể thao
- Tâm lý
- Bệnh lý
- Thuốc
- Khác

## Troubleshooting

### Lỗi thường gặp

#### 1. "Missing parameter" error
**Nguyên nhân:** Thiếu các trường bắt buộc
**Giải pháp:** Kiểm tra và điền đầy đủ title, contentMarkdown, authors, category

#### 2. Image upload fails
**Nguyên nhân:** File quá lớn hoặc định dạng không hỗ trợ
**Giải pháp:** Sử dụng file JPG, PNG, GIF với kích thước < 5MB

#### 3. Markdown editor không hoạt động
**Nguyên nhân:** Thiếu dependencies
**Giải pháp:** Cài đặt `react-markdown-editor-lite` và `markdown-it`

### Debug
```javascript
// Kiểm tra state trước khi submit
console.log('Handbook data:', handbookData);

// Kiểm tra response từ API
console.log('API response:', res);
```

## Performance Optimization

### 1. Lazy Loading
- Markdown editor chỉ load khi cần thiết
- Image preview được optimize

### 2. Form Validation
- Client-side validation để giảm server load
- Real-time validation feedback

### 3. State Management
- Efficient state updates
- Proper cleanup trong componentWillUnmount

## Future Improvements

### 1. Tính năng có thể thêm
- **Auto-save**: Tự động lưu draft
- **Image editor**: Chỉnh sửa ảnh inline
- **Template system**: Mẫu cẩm nang có sẵn
- **Collaboration**: Nhiều người cùng edit
- **Version control**: Lịch sử thay đổi

### 2. UI/UX Enhancements
- **Drag & drop**: Upload ảnh bằng kéo thả
- **Rich text editor**: Thay thế markdown editor
- **Preview mode**: Xem trước trước khi publish
- **Bulk operations**: Tạo nhiều cẩm nang cùng lúc

### 3. Analytics
- **Usage tracking**: Theo dõi thời gian edit
- **Error tracking**: Log lỗi chi tiết
- **Performance metrics**: Đo lường hiệu suất

## Migration Notes

### Từ version cũ
1. **Database**: Chạy migration để thêm các trường mới
2. **Frontend**: Update component để sử dụng trường mới
3. **Backend**: Update service và controller
4. **Testing**: Kiểm tra tất cả functionality

### Rollback Plan
1. Backup database trước khi migration
2. Có sẵn migration down script
3. Test trên staging environment trước

## Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs
2. Xem network tab trong DevTools
3. Kiểm tra database connection
4. Liên hệ development team

---

**Version:** 2.0.0  
**Last Updated:** January 2024  
**Author:** Development Team
