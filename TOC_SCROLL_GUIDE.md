# Hướng dẫn khắc phục vấn đề TOC Scroll

## Vấn đề
Khi bấm vào danh mục trong "Nội dung chính", trang không cuộn đến đúng vị trí của heading tương ứng.

## Nguyên nhân có thể
1. **Timing issue**: DOM chưa được render hoàn toàn khi click
2. **ID mismatch**: ID của TOC item không khớp với ID của heading
3. **Offset calculation**: Header height không chính xác
4. **Content processing**: Content HTML chưa được xử lý đúng cách

## Các cải tiến đã thực hiện

### 1. Cải thiện timing với requestAnimationFrame
```javascript
scrollToSection = (sectionTitle, index, sectionId) => {
  requestAnimationFrame(() => {
    const element = document.getElementById(sectionId);
    // ... rest of the code
  });
};
```

### 2. Tạo ID duy nhất và đáng tin cậy
```javascript
// Tạo ID dựa trên text content và index
const text = heading.textContent.trim().toLowerCase();
const sanitizedText = text.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
const sectionId = `section-${index}-${sanitizedText.substring(0, 20)}`;
```

### 3. Thêm scroll-margin-top cho CSS
```scss
h1, h2, h3, h4, h5, h6 {
  scroll-margin-top: 120px; // Đảm bảo scroll đến đúng vị trí
}
```

### 4. Cải thiện offset calculation
```javascript
const headerHeight = 100; // Tăng offset để tránh bị che bởi header
```

## Cách debug

### 1. Sử dụng test script
Chạy script trong `test-toc-scroll.js` trong browser console:
```javascript
// Copy và paste vào browser console khi đang ở trang HandBookDetail
```

### 2. Kiểm tra console logs
Mở Developer Tools > Console và xem các log:
- "Generated TOC: [...]"
- "Scrolling to section: {...}"
- "Found element: ..."

### 3. Kiểm tra DOM elements
```javascript
// Kiểm tra TOC items
document.querySelectorAll('.toc-item').forEach((item, i) => {
  console.log(`TOC ${i}:`, item.querySelector('.toc-link').textContent);
});

// Kiểm tra headings
document.querySelectorAll('.content-html h1, .content-html h2, .content-html h3').forEach((h, i) => {
  console.log(`Heading ${i}:`, h.textContent, h.id);
});
```

## Các bước khắc phục

### Bước 1: Kiểm tra TOC generation
1. Mở trang HandBookDetail
2. Mở Developer Tools > Console
3. Kiểm tra log "Generated TOC: [...]"
4. Đảm bảo TOC có đủ items và ID đúng

### Bước 2: Kiểm tra DOM elements
1. Chạy test script trong console
2. Kiểm tra xem có bao nhiêu TOC items và headings
3. Đảm bảo ID của TOC khớp với ID của headings

### Bước 3: Kiểm tra scroll behavior
1. Click vào một TOC item
2. Xem console logs để kiểm tra:
   - Element có được tìm thấy không
   - Vị trí scroll có đúng không
3. Kiểm tra xem có highlight effect không

### Bước 4: Điều chỉnh offset nếu cần
Nếu scroll vẫn không đúng vị trí, điều chỉnh `headerHeight` trong `scrollToSection`:
```javascript
const headerHeight = 120; // Tăng hoặc giảm giá trị này
```

## Troubleshooting

### Vấn đề: TOC không hiển thị
- Kiểm tra xem content có headings không
- Kiểm tra `generateTOCFromContent` function

### Vấn đề: Click TOC không scroll
- Kiểm tra console logs
- Đảm bảo element có ID đúng
- Kiểm tra timing với requestAnimationFrame

### Vấn đề: Scroll sai vị trí
- Điều chỉnh `headerHeight` value
- Kiểm tra `scroll-margin-top` trong CSS
- Đảm bảo header không che content

### Vấn đề: Không có highlight effect
- Kiểm tra CSS cho `.highlighted` class
- Đảm bảo `highlightSection` function được gọi
- Kiểm tra animation CSS

## Kết luận
Với các cải tiến đã thực hiện, chức năng TOC scroll sẽ hoạt động ổn định hơn. Nếu vẫn có vấn đề, sử dụng các bước debug trên để xác định nguyên nhân cụ thể.
