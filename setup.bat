@echo off
echo 正在安装项目依赖...

REM 检查是否安装了Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo 错误: 请先安装Node.js
  echo 访问 https://nodejs.org/ 下载并安装
  pause
  exit /b 1
)

REM 安装依赖
call npm install

echo.
echo 依赖安装完成!
echo.
echo 使用以下命令:
echo - npm start    : 启动应用进行测试
echo - npm run dist : 打包应用为安装程序
echo.
pause 