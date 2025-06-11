@echo off
chcp 65001 >nul

echo === 医学学术会议后端服务启动脚本 ===
echo.

:: 检查Python是否安装
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未找到Python。请安装Python后再运行此脚本。
    pause
    exit /b 1
)

:: 检查pip是否安装
pip --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未找到pip。请安装pip后再运行此脚本。
    pause
    exit /b 1
)

:: 检查虚拟环境目录是否存在
if not exist venv (
    echo 创建Python虚拟环境...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo 错误: 创建虚拟环境失败。
        pause
        exit /b 1
    )
    echo 虚拟环境创建成功!
    echo.
)

:: 激活虚拟环境
echo 激活虚拟环境...
call venv\Scripts\activate.bat
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 激活虚拟环境失败。
    pause
    exit /b 1
)
echo 虚拟环境已激活!
echo.

:: 安装依赖
echo 安装依赖...
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 安装依赖失败。
    pause
    exit /b 1
)
echo 依赖安装成功!
echo.

:: 创建上传目录
if not exist uploads (
    echo 创建上传目录...
    mkdir uploads
    echo 上传目录创建成功!
    echo.
)

:: 启动后端服务
echo 启动后端服务...
echo 后端服务将在 http://localhost:5000 运行
echo 按 Ctrl+C 停止服务
echo.

python app.py
pause