const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

// 保持对window对象的全局引用，避免JavaScript对象被垃圾回收时窗口关闭
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // 禁用同源策略，解决CORS问题
      preload: path.join(__dirname, 'preload.js') // 添加preload脚本
    },
    icon: path.join(__dirname, 'icon.ico')
  });

  // 加载index.html
  mainWindow.loadFile('index.html');

  // 创建开发者菜单
  const devMenu = Menu.buildFromTemplate([
    {
      label: '开发',
      submenu: [
        {
          label: '打开开发者工具',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.openDevTools();
          }
        },
        {
          label: '重新加载页面',
          accelerator: 'F5',
          click: () => {
            mainWindow.reload();
          }
        },
        {
          label: '检查资源',
          click: () => {
            mainWindow.webContents.send('check-resources');
          }
        }
      ]
    }
  ]);
  
  // 设置菜单
  Menu.setApplicationMenu(devMenu);

  // 注册打开开发者工具的快捷键
  globalShortcut.register('F12', () => {
    mainWindow.webContents.openDevTools();
  });
  
  // 注册刷新页面的快捷键
  globalShortcut.register('F5', () => {
    mainWindow.reload();
  });

  // 监听页面加载完成事件，自动打开开发工具方便调试
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
    // 打开开发者工具 - 开发阶段使用，发布时可注释
    // mainWindow.webContents.openDevTools(); // 已注释，默认关闭调试模式
  });

  // 窗口关闭时触发
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Electron初始化完成并准备创建浏览器窗口时调用
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用，macOS除外
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // macOS中点击Dock图标重新创建窗口
  if (mainWindow === null) createWindow();
});

// 应用退出前注销所有快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 