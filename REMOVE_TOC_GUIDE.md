# Hướng dẫn Xóa TOC khỏi Backend

## Tổng quan

Hướng dẫn này sẽ giúp bạn xóa hoàn toàn field `toc` khỏi backend và database, vì bây giờ TOC sẽ được tạo tự động từ nội dung HTML.

## Các bước thực hiện

### 1. **Chạy Migration để xóa TOC khỏi Database**

```bash
# Chạy script migration
cd NodeJs
node remove-toc-migration.js
```

Hoặc chạy trực tiếp SQL:
```sql
ALTER TABLE HandBooks DROP COLUMN toc;
```

### 2. **Files đã được cập nhật**

#### Backend Files:
- ✅ `NodeJs/src/models/handbook.js` - Xóa field `toc` khỏi model
- ✅ `NodeJs/src/services/handbookServices.js` - Xóa tất cả references đến `toc`
- ✅ `NodeJs/src/migrations/migrate-create-handbook.js` - Xóa field `toc` khỏi migration ban đầu
- ✅ `NodeJs/src/migrations/migrate-update-handbook.js` - Xóa field `toc` khỏi migration update

#### Frontend Files:
- ✅ `ReactJs/src/containers/System/HandBook/ManageHandbook.js` - Xóa field `toc` khỏi form
- ✅ `ReactJs/src/test-manage-handbook.js` - Cập nhật test script

#### Migration Files:
- ✅ `NodeJs/src/migrations/migrate-remove-toc.js` - Migration để xóa TOC
- ✅ `NodeJs/remove-toc-migration.js` - Script để chạy migration

### 3. **Chi tiết các thay đổi**

#### Model (handbook.js):
```javascript
// Trước:
{
  toc: DataTypes.TEXT, // JSON string for table of contents
}

// Sau:
// Field toc đã được xóa
```

#### Service (handbookServices.js):
```javascript
// Trước:
await db.HandBook.create({
  // ... other fields
  toc: data.toc || "",
});

// Sau:
await db.HandBook.create({
  // ... other fields
  // toc field removed
});
```

#### Frontend (ManageHandbook.js):
```javascript
// Trước:
this.state = {
  // ... other fields
  toc: "",
};

// Sau:
this.state = {
  // ... other fields
  // toc field removed
};
```

### 4. **Kiểm tra sau khi xóa**

#### Database:
```sql
-- Kiểm tra xem column toc đã được xóa chưa
DESCRIBE HandBooks;
```

#### API Test:
```bash
# Test API tạo handbook mới (không có toc)
curl -X POST http://localhost:8080/api/create-new-handbook \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Handbook",
    "contentHTML": "<h1>Test</h1>",
    "contentMarkdown": "# Test",
    "authors": "Test Author",
    "category": "Test"
  }'
```

#### Frontend Test:
1. Mở trang ManageHandbook
2. Tạo handbook mới
3. Kiểm tra xem không còn field TOC trong form
4. Verify handbook được tạo thành công

### 5. **Lợi ích sau khi xóa TOC**

#### 1. **Giảm độ phức tạp**
- Không cần quản lý TOC trong database
- Không cần validate TOC data
- Giảm kích thước database

#### 2. **Tính nhất quán**
- TOC luôn đồng bộ với nội dung
- Không có trường hợp TOC cũ/không chính xác
- Tự động cập nhật khi nội dung thay đổi

#### 3. **Dễ bảo trì**
- Ít code hơn để maintain
- Không cần migration khi thay đổi TOC logic
- Giảm bugs liên quan đến TOC

### 6. **Rollback (nếu cần)**

Nếu cần rollback, có thể chạy:
```sql
-- Thêm lại column toc
ALTER TABLE HandBooks ADD COLUMN toc TEXT;
```

Hoặc sử dụng migration rollback:
```bash
# Rollback migration
cd NodeJs
npx sequelize-cli db:migrate:undo --name migrate-remove-toc.js
```

### 7. **Troubleshooting**

#### Lỗi "Unknown column 'toc'"
- Column đã được xóa thành công
- Có thể bỏ qua lỗi này

#### Lỗi khi tạo handbook mới
- Kiểm tra xem tất cả references đến `toc` đã được xóa chưa
- Restart server sau khi cập nhật code

#### Frontend vẫn hiển thị field TOC
- Clear browser cache
- Restart development server
- Kiểm tra xem file ManageHandbook.js đã được cập nhật chưa

### 8. **Verification Checklist**

- [ ] Database column `toc` đã được xóa
- [ ] Model không còn field `toc`
- [ ] Service không còn xử lý `toc`
- [ ] Frontend form không còn field `toc`
- [ ] API tạo handbook hoạt động bình thường
- [ ] TOC tự động được tạo từ nội dung HTML
- [ ] Không có lỗi trong console

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Author:** Development Team
