// electron-fix.js
// 这个文件用于在Electron环境中修复路径和资源加载问题

// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
  console.log('electron-fix.js 已加载');

  // 检测是否在Electron环境中
  const isElectron = window.electron !== undefined;
  console.log('是否在Electron环境中:', isElectron);

  if (isElectron) {
    // 获取应用路径
    const appPath = window.electron.getAppPath();
    console.log('应用路径:', appPath);

    // 修复图标问题
    fixIcons();
    
    // 如果在render.html页面，修复模型加载问题
    if (window.location.href.includes('render.html')) {
      fixModelLoading();
    }
  }

  // 修复图标问题
  function fixIcons() {
    // 检查CSS是否正确加载
    const allLinks = document.querySelectorAll('link[rel="stylesheet"]');
    console.log('已加载的CSS文件:', Array.from(allLinks).map(link => link.href));

    // 如果需要，重新加载图标CSS
    const fontAwesomeLink = Array.from(allLinks).find(link => link.href.includes('all.min.css'));
    if (!fontAwesomeLink) {
      console.log('未发现Font Awesome CSS，正在尝试手动加载');
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = './all.min.css';
      document.head.appendChild(newLink);
    }
  }

  // 修复模型加载问题
  function fixModelLoading() {
    console.log('正在修复模型加载问题');
    
    // 修改BABYLON.SceneLoader.Load方法来修复路径
    if (window.BABYLON && window.BABYLON.SceneLoader) {
      console.log('劫持BABYLON.SceneLoader.Load和ImportMesh方法');
      
      // 保存原始方法
      const originalImportMesh = BABYLON.SceneLoader.ImportMesh;
      
      // 覆盖ImportMesh方法
      BABYLON.SceneLoader.ImportMesh = function(meshNames, sceneFilePath, fileName, scene, onSuccess, onProgress, onError) {
        console.log('调用修改后的ImportMesh方法');
        console.log('原始路径:', sceneFilePath, fileName);
        
        // 检查路径是否需要修复
        if (sceneFilePath && !sceneFilePath.startsWith('./') && !sceneFilePath.startsWith('/')) {
          console.log('修复模型路径');
          sceneFilePath = './' + sceneFilePath;
        }
        
        console.log('修复后路径:', sceneFilePath, fileName);
        
        // 调用原始方法
        return originalImportMesh.call(this, meshNames, sceneFilePath, fileName, scene, 
          function(...args) {
            console.log('模型加载成功:', fileName);
            if (onSuccess) onSuccess(...args);
          },
          function(...args) {
            console.log('模型加载进度:', args);
            if (onProgress) onProgress(...args);
          },
          function(error) {
            console.error('模型加载失败:', error);
            // 在此处添加备用加载逻辑
            if (onError) onError(error);
          }
        );
      };
    }
    
    // 覆盖getFloorModelFiles函数
    window.addEventListener('load', function() {
      console.log('页面完全加载，准备修复getFloorModelFiles函数');
      
      // 定时器确保原始函数已定义
      setTimeout(() => {
        if (typeof getFloorModelFiles === 'function') {
          console.log('找到getFloorModelFiles函数，准备覆盖');
          
          // 保存原始函数
          const originalGetFloorModelFiles = window.getFloorModelFiles;
          
          // 替换为新函数
          window.getFloorModelFiles = function() {
            console.log('调用修改后的getFloorModelFiles函数');
            
            // 获取当前URL参数
            const urlParams = new URLSearchParams(window.location.search);
            const folderName = urlParams.get('name');
            console.log('当前建筑:', folderName);
            
            return Promise.resolve({
              files: window.buildConfig[folderName] || ['1', '2', '3', '4', '5', '6', '7', '8'],
              path: './build/' + folderName + '/'
            });
          };
        } else {
          console.log('未找到getFloorModelFiles函数');
        }
      }, 1000);
    });
  }
}); 