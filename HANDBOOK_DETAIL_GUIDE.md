# Hướng dẫn sử dụng trang HandBookDetail đã được cải thiện

## Tổng quan

Trang HandBookDetail đã được cải thiện với nhiều tính năng mới và giao diện đẹp hơn. Dưới đây là các tính năng chính:

## Tính năng mới

### 1. **Error Handling tốt hơn**
- Xử lý lỗi khi không tìm thấy bài viết
- Xử lý lỗi khi API không phản hồi
- Hiển thị thông báo lỗi thân thiện với người dùng
- Nút điều hướng về trang chủ hoặc trang cẩm nang

### 2. **Loading State đẹp hơn**
- Sử dụng component LoadingSpinner tùy chỉnh
- Animation loading mượt mà
- Thông báo loading rõ ràng

### 3. **Breadcrumb Navigation**
- Hiển thị đường dẫn điều hướng
- Cho phép người dùng quay lại các trang trước đó
- Tăng trải nghiệm người dùng

### 4. **Social Sharing**
- Chia sẻ bài viết lên Facebook, Twitter, LinkedIn
- Sao chép link bài viết
- Tăng khả năng lan tỏa nội dung

### 5. **Related Articles**
- Hiển thị bài viết liên quan
- API riêng để lấy bài viết liên quan
- Sắp xếp theo lượt xem và ngày tạo

### 6. **Responsive Design**
- Tối ưu cho mobile, tablet, desktop
- Layout thích ứng với kích thước màn hình
- Typography responsive

### 7. **Sidebar với tính năng bổ sung**
- Table of Contents (nếu có)
- Nút đặt lịch khám
- Nút chat với AI Assistant

### 8. **View Counter**
- Tự động tăng lượt xem khi người dùng vào trang
- Hiển thị số lượt xem trong banner

## Cấu trúc Database mới

### Bảng HandBook đã được mở rộng:

```sql
-- Các trường mới được thêm vào
authors TEXT,           -- Tác giả (JSON string hoặc plain text)
reviewers TEXT,         -- Người kiểm duyệt (JSON string hoặc plain text)
published DATEONLY,     -- Ngày xuất bản
updated DATEONLY,       -- Ngày cập nhật cuối
views INTEGER,          -- Số lượt xem (default: 0)
toc TEXT,              -- Table of contents (JSON string)
category STRING         -- Danh mục (default: "Cẩm nang")
```

## API Endpoints

### 1. **Get Handbook Detail**
```
GET /api/get-detail-handbook-by-id?id={id}
```

**Response:**
```json
{
  "errCode": 0,
  "errMessage": "ok",
  "data": {
    "id": 1,
    "title": "Tiêu đề bài viết",
    "contentHTML": "Nội dung HTML",
    "contentMarkdown": "Nội dung Markdown",
    "image": "URL hình ảnh",
    "authors": ["Tác giả 1", "Tác giả 2"],
    "reviewers": ["Người kiểm duyệt 1"],
    "published": "2024-01-01",
    "updated": "2024-01-15",
    "views": 150,
    "toc": ["Mục 1", "Mục 2", "Mục 3"],
    "category": "Cẩm nang"
  }
}
```

### 2. **Get Related Handbooks**
```
GET /api/get-related-handbooks?id={id}&limit={limit}
```

**Response:**
```json
{
  "errCode": 0,
  "errMessage": "ok",
  "data": [
    {
      "id": 2,
      "title": "Bài viết liên quan",
      "image": "URL hình ảnh",
      "published": "2024-01-10",
      "views": 120,
      "category": "Cẩm nang"
    }
  ]
}
```

## Components mới

### 1. **LoadingSpinner**
```jsx
import LoadingSpinner from '../components/LoadingSpinner';

<LoadingSpinner 
  size="large" 
  text="Đang tải bài viết..." 
  fullScreen={false} 
/>
```

**Props:**
- `size`: "small" | "medium" | "large"
- `text`: Text hiển thị
- `fullScreen`: Boolean để hiển thị full screen

### 2. **ErrorBoundary**
```jsx
import ErrorBoundary from '../components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Styling

### File SCSS chính: `HandBookDetail.scss`
- Responsive design
- Modern UI với shadows và border-radius
- Smooth transitions và hover effects
- Typography được tối ưu cho đọc

### Các breakpoints:
- Desktop: > 992px
- Tablet: 768px - 991px  
- Mobile: < 768px

## Migration

### Chạy migration để cập nhật database:
```bash
cd NodeJs
npx sequelize-cli db:migrate
```

Migration sẽ:
- Thêm các trường mới vào bảng HandBooks
- Cập nhật dữ liệu hiện có với giá trị mặc định
- Đảm bảo tương thích ngược

## Cách sử dụng

### 1. **Truy cập trang**
```
/handbook/{id}
```

### 2. **Navigation**
- Breadcrumb để điều hướng
- Nút "Về trang chủ" và "Xem cẩm nang khác" khi có lỗi

### 3. **Social Sharing**
- Click vào các nút chia sẻ để chia sẻ bài viết
- Nút "Sao chép link" để copy URL

### 4. **Related Articles**
- Click vào bài viết liên quan để chuyển trang
- Hiển thị tối đa 4 bài viết

## Tối ưu hóa

### 1. **Performance**
- Lazy loading cho related articles
- Optimized images với object-fit
- Efficient error handling

### 2. **SEO**
- Semantic HTML structure
- Meta tags (cần thêm)
- Structured data (cần thêm)

### 3. **Accessibility**
- ARIA labels
- Keyboard navigation
- Screen reader friendly

## Troubleshooting

### 1. **Lỗi "Handbook not found"**
- Kiểm tra ID bài viết có tồn tại không
- Kiểm tra database connection

### 2. **Lỗi loading**
- Kiểm tra API endpoints
- Kiểm tra network connection
- Xem console logs

### 3. **Lỗi styling**
- Đảm bảo file SCSS được import
- Kiểm tra Bootstrap CSS
- Kiểm tra Font Awesome icons

## Future Improvements

### 1. **SEO Optimization**
- Thêm meta tags
- Structured data
- Sitemap generation

### 2. **Performance**
- Image optimization
- Code splitting
- Caching strategies

### 3. **Features**
- Comments system
- Rating system
- Print functionality
- Dark mode

### 4. **Analytics**
- Track user behavior
- A/B testing
- Performance monitoring
