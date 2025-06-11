# 医学学术会议网站后端服务器

这是医学学术会议网站的后端服务器，提供参会者注册、登录、论文上传和互动交流等功能的API接口。

## 功能特点

- 参会者注册与登录（JWT认证）
- 论文上传与管理
- 互动交流区提问与回答
- 用户信息管理

## 技术栈

- Python 3.8+
- Flask Web框架
- SQLite数据库
- JWT认证

## 安装与运行

### 前提条件

- Python 3.8或更高版本
- pip包管理器

### 安装步骤

1. 克隆或下载本项目到本地

2. 进入项目目录
   ```
   cd server
   ```

3. 安装依赖包
   ```
   pip install -r requirements.txt
   ```

4. 运行服务器
   ```
   python app.py
   ```

服务器将在 http://localhost:5000 上运行。

## API接口文档

### 用户认证

#### 注册新用户
- **URL**: `/api/register`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "用户名",
    "password": "密码",
    "email": "邮箱",
    "full_name": "姓名",
    "affiliation": "所属机构",
    "title": "职称",
    "phone": "电话号码"
  }
  ```
- **成功响应**: `201 Created`
  ```json
  {
    "message": "注册成功",
    "user_id": 1,
    "token": "JWT令牌"
  }
  ```

#### 用户登录
- **URL**: `/api/login`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- **成功响应**: `200 OK`
  ```json
  {
    "message": "登录成功",
    "user_id": 1,
    "token": "JWT令牌"
  }
  ```

### 论文管理

#### 上传论文
- **URL**: `/api/papers/upload`
- **方法**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **请求体**: `multipart/form-data`
  - `file`: 论文文件 (PDF, DOC, DOCX)
  - `title`: 论文标题
  - `abstract`: 摘要
  - `keywords`: 关键词
- **成功响应**: `201 Created`
  ```json
  {
    "message": "论文上传成功",
    "paper_id": 1,
    "file_path": "文件路径"
  }
  ```

#### 获取用户论文列表
- **URL**: `/api/papers/user`
- **方法**: `GET`
- **请求头**: `Authorization: Bearer {token}`
- **成功响应**: `200 OK`
  ```json
  [
    {
      "id": 1,
      "title": "论文标题",
      "abstract": "摘要",
      "keywords": "关键词",
      "file_path": "文件路径",
      "original_filename": "原始文件名",
      "upload_date": "上传日期"
    }
  ]
  ```

#### 下载论文
- **URL**: `/api/papers/download/{paper_id}`
- **方法**: `GET`
- **请求头**: `Authorization: Bearer {token}`
- **成功响应**: 文件下载

### 互动交流

#### 发布问题
- **URL**: `/api/questions`
- **方法**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
  ```json
  {
    "title": "问题标题",
    "content": "问题内容"
  }
  ```
- **成功响应**: `201 Created`
  ```json
  {
    "message": "问题发布成功",
    "question_id": 1
  }
  ```

#### 获取问题列表
- **URL**: `/api/questions?page=1&per_page=10`
- **方法**: `GET`
- **成功响应**: `200 OK`
  ```json
  {
    "questions": [
      {
        "id": 1,
        "title": "问题标题",
        "content": "问题内容",
        "post_date": "发布日期",
        "user_id": 1,
        "username": "用户名",
        "answer_count": 2
      }
    ],
    "total": 20,
    "page": 1,
    "per_page": 10,
    "pages": 2
  }
  ```

#### 获取问题详情及回答
- **URL**: `/api/questions/{question_id}`
- **方法**: `GET`
- **成功响应**: `200 OK`
  ```json
  {
    "question": {
      "id": 1,
      "title": "问题标题",
      "content": "问题内容",
      "post_date": "发布日期",
      "user_id": 1,
      "username": "用户名"
    },
    "answers": [
      {
        "id": 1,
        "content": "回答内容",
        "post_date": "发布日期",
        "user_id": 2,
        "username": "回答者用户名"
      }
    ]
  }
  ```

#### 回答问题
- **URL**: `/api/questions/{question_id}/answers`
- **方法**: `POST`
- **请求头**: `Authorization: Bearer {token}`
- **请求体**:
  ```json
  {
    "content": "回答内容"
  }
  ```
- **成功响应**: `201 Created`
  ```json
  {
    "message": "回答发布成功",
    "answer_id": 1
  }
  ```

### 用户信息

#### 获取当前用户信息
- **URL**: `/api/users/me`
- **方法**: `GET`
- **请求头**: `Authorization: Bearer {token}`
- **成功响应**: `200 OK`
  ```json
  {
    "id": 1,
    "username": "用户名",
    "email": "邮箱",
    "full_name": "姓名",
    "affiliation": "所属机构",
    "title": "职称",
    "phone": "电话号码",
    "registration_date": "注册日期"
  }
  ```

## 数据库结构

### users表
- id: 用户ID (主键)
- username: 用户名 (唯一)
- password: 密码 (哈希值)
- email: 邮箱 (唯一)
- full_name: 姓名
- affiliation: 所属机构
- title: 职称
- phone: 电话号码
- registration_date: 注册日期

### papers表
- id: 论文ID (主键)
- user_id: 用户ID (外键)
- title: 论文标题
- abstract: 摘要
- keywords: 关键词
- file_path: 文件路径
- original_filename: 原始文件名
- upload_date: 上传日期

### questions表
- id: 问题ID (主键)
- user_id: 用户ID (外键)
- title: 问题标题
- content: 问题内容
- post_date: 发布日期

### answers表
- id: 回答ID (主键)
- question_id: 问题ID (外键)
- user_id: 用户ID (外键)
- content: 回答内容
- post_date: 发布日期

## 安全说明

- 用户密码使用SHA-256哈希存储
- 使用JWT令牌进行API认证
- 文件上传有类型和大小限制
- 使用安全的文件名处理

## 许可证

本项目采用MIT许可证。详见LICENSE文件。