# 如何将应用打包为Windows可执行程序(EXE)

本指南详细介绍如何将中国古建筑3D模型展示应用打包为独立的Windows可执行程序(.exe文件)。

## 准备工作

### 1. 安装必要软件
- **安装Node.js**：访问[Node.js官网](https://nodejs.org/)下载并安装最新的LTS版本
- **安装Git**（可选）：如果需要从代码库克隆项目，请安装[Git](https://git-scm.com/)

### 2. 获取项目源代码
- 将项目代码下载或克隆到本地目录

## 构建步骤

### Windows系统

1. **准备环境**
   - 打开命令提示符或PowerShell
   - 进入项目目录
   - 双击运行`setup.bat`，或在命令行中执行该脚本
   - 这将安装所有必要的依赖项

2. **测试应用**
   - 运行命令：`npm start`
   - 应用将启动，验证功能是否正常
   - 关闭应用后继续下一步

3. **打包应用**
   - 运行命令：`npm run dist`
   - 等待打包过程完成（可能需要几分钟时间）
   - 打包完成后，在`release`目录中将生成安装程序

4. **安装程序文件**
   - 在`release`目录中找到`中国古建筑3D模型 Setup x.x.x.exe`文件
   - 这是可分发的安装程序
   - 也可能会生成一个`win-unpacked`目录，其中包含免安装版应用

### 构建参数调整

如需调整构建参数，可编辑`package.json`文件中的`build`部分：

```json
"build": {
  "appId": "com.toybuild.ancientbuildings",
  "productName": "中国古建筑3D模型",
  "...": "..."
}
```

### 常见问题

1. **打包过程中遇到错误**
   - 确保已安装最新版本的Node.js
   - 尝试删除`node_modules`目录并重新运行`setup.bat`
   - 检查错误信息，可能需要安装额外的系统依赖

2. **生成的应用无法启动**
   - 检查您的系统是否满足最低要求
   - 确保已安装.NET Framework (Windows系统)
   - 检查应用日志文件了解错误详情

3. **应用打包体积过大**
   - 在`package.json`的`build.files`部分调整要包含的文件
   - 考虑移除不必要的资源或优化3D模型文件

## 分发应用

打包完成后，您可以通过以下方式分发应用：

1. **安装包分发**
   - 分享`release`目录中的安装程序(.exe文件)
   - 用户只需双击该文件并按照向导安装应用

2. **便携版分发**
   - 压缩`win-unpacked`目录的内容成zip文件
   - 用户解压后即可运行，无需安装

## 技术备注

该打包过程使用了以下技术：
- Electron：跨平台桌面应用框架
- electron-builder：Electron应用打包工具
- NSIS：生成Windows安装程序的脚本系统 


## docker 
```
docker run --rm -ti \
   --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
   --env ELECTRON_CACHE="/root/.cache/electron" \
   --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
   -v ${PWD}:/project \
   -v ${PWD##*/}-node-modules:/project/node_modules \
   -v ~/.cache/electron:/root/.cache/electron \
   -v ~/.cache/electron-builder:/root/.cache/electron-builder \
   electronuserland/builder:wine \
   /bin/bash -c "npm install && npm run dist:win"
```