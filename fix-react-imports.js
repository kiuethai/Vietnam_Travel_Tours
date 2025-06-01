import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Bắt đầu sửa file react-redux Context.js...');

// Sửa file react-redux Context.js
const contextPath = path.join(__dirname, 'node_modules/react-redux/es/components/Context.js');

try {
  let content = fs.readFileSync(contextPath, 'utf8');
  console.log('📖 Đã đọc file Context.js');
  
  // Thay thế import, xử lý cả hai trường hợp có dấu nháy đơn hoặc nháy kép
  if (content.includes("import { createContext } from 'react';") || 
      content.includes('import { createContext } from "react";') ||
      content.includes("import { default as process } from \"\\0polyfill-node.process\";")) {
    
    content = content.replace(
      /import\s*{\s*createContext\s*}\s*from\s*["']react["'];?/,
      "import React from 'react';\nconst createContext = React.createContext;"
    );
    
    // Xử lý trường hợp có import polyfill-node.process
    content = content.replace(
      /import\s*{\s*default\s+as\s+process\s*}\s*from\s*["']\\0polyfill-node\.process["'];?/,
      "// import process được xử lý bởi vite"
    );
    
    fs.writeFileSync(contextPath, content);
    console.log('✅ Đã sửa file Context.js thành công!');
  } else {
    console.log('ℹ️ File đã được sửa trước đó hoặc có định dạng khác.');
  }
} catch (error) {
  console.error('❌ Lỗi:', error.message);
  process.exit(1);
}
