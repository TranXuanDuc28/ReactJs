# Responsive Design Guide

## Tổng quan
Dự án ReactJs đã được cập nhật với responsive design để hỗ trợ tất cả các thiết bị từ desktop đến mobile.

## Breakpoints
- **xs**: ≤ 576px (Mobile)
- **sm**: ≤ 768px (Tablet)
- **md**: ≤ 992px (Small Desktop)
- **lg**: ≤ 1200px (Desktop)
- **xl**: ≤ 1400px (Large Desktop)

## Cách sử dụng

### 1. Import responsive
```scss
@import "../../styles/common.scss";
// File common.scss đã import responsive
```

### 2. Sử dụng mixin responsive
```scss
.your-class {
  // Desktop styles
  padding: 20px;
  font-size: 16px;
  
  // Tablet styles
  @include respond-to(sm) {
    padding: 15px;
    font-size: 14px;
  }
  
  // Mobile styles
  @include respond-to(xs) {
    padding: 10px;
    font-size: 12px;
  }
}
```

### 3. Sử dụng utility classes
```scss
// Responsive flexbox
.flex-responsive {
  display: flex;
  
  @include respond-to(sm) {
    flex-direction: column;
  }
}

// Responsive grid
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  @include respond-to(sm) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

// Responsive spacing
.p-responsive {
  padding: 20px;
  
  @include respond-to(sm) {
    padding: 15px;
  }
  
  @include respond-to(xs) {
    padding: 10px;
  }
}
```

## Các file đã được responsive

### Components
- ✅ `Navigator.scss` - Navigation menu
- ✅ `InputSuggest.scss` - Input suggestions
- ✅ `LoadingSpinner.scss` - Loading spinner
- ✅ `ErrorBoundary.scss` - Error boundary
- ✅ `CustomToast.scss` - Toast notifications
- ✅ `ConfirmModal.scss` - Confirmation modal

### Containers
- ✅ `Header.scss` - Header component
- ✅ `HomePage.scss` - Homepage (đã có responsive)
- ✅ `Login.scss` - Login form
- ✅ `PatientChat.scss` - Chat interface
- ✅ `DetailDoctors.scss` - Doctor details
- ✅ `DetailClinic.scss` - Clinic details
- ✅ `DetailSpecialty.scss` - Specialty details
- ✅ `ManageDoctor.scss` - Doctor management
- ✅ `ManageSpecialty.scss` - Specialty management
- ✅ `ManageClinic.scss` - Clinic management

## Best Practices

### 1. Mobile-first approach
```scss
// Bắt đầu với mobile styles
.your-class {
  padding: 10px;
  font-size: 14px;
  
  // Sau đó override cho màn hình lớn hơn
  @include respond-from(sm) {
    padding: 20px;
    font-size: 16px;
  }
}
```

### 2. Sử dụng flexbox responsive
```scss
.container {
  display: flex;
  gap: 20px;
  
  @include respond-to(sm) {
    flex-direction: column;
    gap: 15px;
  }
}
```

### 3. Responsive images
```scss
.image {
  width: 100%;
  height: auto;
  max-width: 500px;
  
  @include respond-to(sm) {
    max-width: 100%;
  }
}
```

### 4. Responsive typography
```scss
.title {
  font-size: 24px;
  
  @include respond-to(sm) {
    font-size: 20px;
  }
  
  @include respond-to(xs) {
    font-size: 18px;
  }
}
```

## Testing

### 1. Browser DevTools
- Sử dụng Device Toolbar để test các breakpoint
- Test với các kích thước màn hình khác nhau

### 2. Real devices
- Test trên mobile thật
- Test trên tablet thật
- Kiểm tra touch interactions

### 3. Performance
- Đảm bảo responsive không ảnh hưởng performance
- Sử dụng CSS transforms thay vì thay đổi layout

## Troubleshooting

### 1. Layout bị vỡ
- Kiểm tra container width
- Sử dụng `overflow: hidden` khi cần thiết
- Test với content dài

### 2. Font size quá nhỏ
- Sử dụng `min-font-size` cho mobile
- Kiểm tra readability trên màn hình nhỏ

### 3. Touch targets
- Đảm bảo button có kích thước tối thiểu 44x44px
- Sử dụng `cursor: pointer` cho touch devices

## Cập nhật responsive

Khi thêm component mới, hãy nhớ:

1. Import responsive mixins
2. Sử dụng breakpoints phù hợp
3. Test trên nhiều thiết bị
4. Đảm bảo accessibility
5. Tối ưu performance

## Liên hệ

Nếu có vấn đề với responsive design, hãy kiểm tra:
- CSS specificity
- Media query conflicts
- Browser compatibility
- Device-specific issues
