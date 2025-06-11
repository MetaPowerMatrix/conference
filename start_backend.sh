#!/bin/bash

# 设置颜色变量
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m" # 无颜色

echo -e "${BLUE}=== 医学学术会议后端服务启动脚本 ===${NC}\n"

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}错误: 未找到Python3。请安装Python3后再运行此脚本。${NC}"
    exit 1
fi

# 检查pip是否安装
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}错误: 未找到pip3。请安装pip3后再运行此脚本。${NC}"
    exit 1
fi

# 检查虚拟环境目录是否存在
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}创建Python虚拟环境...${NC}"
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo -e "${RED}错误: 创建虚拟环境失败。${NC}"
        exit 1
    fi
    echo -e "${GREEN}虚拟环境创建成功!${NC}\n"
fi

# 激活虚拟环境
echo -e "${YELLOW}激活虚拟环境...${NC}"
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 激活虚拟环境失败。${NC}"
    exit 1
fi
echo -e "${GREEN}虚拟环境已激活!${NC}\n"

# 安装依赖
echo -e "${YELLOW}安装依赖...${NC}"
pip install -r server/requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 安装依赖失败。${NC}"
    exit 1
fi
echo -e "${GREEN}依赖安装成功!${NC}\n"

# 创建上传目录
if [ ! -d "uploads" ]; then
    echo -e "${YELLOW}创建上传目录...${NC}"
    mkdir -p uploads
    echo -e "${GREEN}上传目录创建成功!${NC}\n"
fi

# 启动后端服务
echo -e "${YELLOW}启动后端服务...${NC}"
echo -e "${BLUE}后端服务将在 http://localhost:5000 运行${NC}"
echo -e "${BLUE}按 Ctrl+C 停止服务${NC}\n"

python server/app.py