// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

// 在窗口加载时执行
window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload脚本已加载');
  
  // 添加调试信息
  const appPath = process.cwd();
  console.log('应用路径:', appPath);
  
  // 检查关键目录是否存在
  const checkDir = (dirPath) => {
    try {
      const stats = fs.statSync(dirPath);
      console.log(`目录 ${dirPath} 存在: ${stats.isDirectory()}`);
      
      // 列出目录内容
      const files = fs.readdirSync(dirPath);
      console.log(`目录 ${dirPath} 包含文件:`, files);
      
      return true;
    } catch (err) {
      console.error(`目录 ${dirPath} 检查失败:`, err);
      return false;
    }
  };
  
  // 检查webfonts目录
  checkDir(path.join(appPath, 'webfonts'));
  
  // 检查build目录
  checkDir(path.join(appPath, 'build'));
  
  // 修复路径和调试
  const fixPaths = () => {
    // 添加调试信息到控制台
    console.log('修复页面已加载');
    
    // 定期检查问题
    setInterval(() => {
      // 检查图标是否正确加载
      const icons = document.querySelectorAll('.fa-solid');
      console.log(`页面上的图标数量: ${icons.length}`);
      
      // 检查是否在模型页面
      if (window.location.href.includes('render.html')) {
        console.log('当前在渲染页面');
        
        // 检查模型加载状态
        const canvas = document.getElementById('renderCanvas');
        if (canvas) {
          console.log('Canvas元素存在');
        }
        
        // 执行错误检查
        checkErrors();
      }
    }, 3000);
  };
  
  // 检查常见错误
  const checkErrors = () => {
    // 查找控制台错误
    const errorTypes = ['Error', 'BABYLON.SceneLoader', '404', 'Failed', 'unable to load'];
    const consoleErrors = [];
    
    // 重写console.error以捕获错误
    const originalError = console.error;
    console.error = (...args) => {
      consoleErrors.push(args.join(' '));
      originalError.apply(console, args);
    };
    
    // 定期报告错误
    setInterval(() => {
      if (consoleErrors.length > 0) {
        console.log('发现错误:', consoleErrors);
        consoleErrors.length = 0; // 清空数组
      }
    }, 5000);
  };
  
  // 执行路径修复
  fixPaths();
});

// 暴露API给渲染进程
contextBridge.exposeInMainWorld('electron', {
  getAppPath: () => process.cwd(),
  checkFileExists: (filePath) => {
    try {
      return fs.existsSync(filePath);
    } catch (err) {
      console.error('文件检查错误:', err);
      return false;
    }
  }
}); 