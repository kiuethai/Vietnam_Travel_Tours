const fs = require('fs');
const path = require('path');

// Đường dẫn đến file index.mjs của react-toastify
const toastifyPath = path.join(__dirname, 'node_modules', 'react-toastify', 'dist', 'index.mjs');

// Đọc nội dung file
let content = fs.readFileSync(toastifyPath, 'utf8');

// Thay thế dòng import isValidElement
content = content.replace(
  `import{isValidElement as $t}from"react";`,
  `const $t = (obj) => obj && obj.$$typeof;` // Thay thế bằng một hàm đơn giản
);

// Ghi lại file đã sửa
fs.writeFileSync(toastifyPath, content);

console.log('React-toastify đã được sửa thành công!');