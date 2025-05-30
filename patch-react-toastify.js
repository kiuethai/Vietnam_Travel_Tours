import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn hiện tại trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn đến file index.mjs của react-toastify
const toastifyPath = path.join(__dirname, 'node_modules', 'react-toastify', 'dist', 'index.mjs');

try {
  // Đọc nội dung file
  let content = fs.readFileSync(toastifyPath, 'utf8');

  // Thay thế dòng import isValidElement
  content = content.replace(
    `import{isValidElement as $t}from"react";`,
    `const $t = (obj) => obj && obj.$$typeof;` 
  );

  // Ghi lại file đã sửa
  fs.writeFileSync(toastifyPath, content);

  console.log('React-toastify đã được sửa thành công!');
} catch (error) {
  console.error('Lỗi khi sửa react-toastify:', error);
}