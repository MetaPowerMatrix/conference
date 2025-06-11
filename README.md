# 医学学术会议网站与小程序

## 环境配置

### 项目根路径配置

本项目中的内容编辑功能需要访问服务器上的文件系统，因此需要配置项目根路径。在不同的服务器环境中，项目根路径可能不同，需要通过环境变量进行配置。

#### 配置步骤

1. 复制项目根目录下的 `.env.example` 文件为 `.env.local`
2. 根据实际部署环境修改 `.env.local` 文件中的 `PROJECT_ROOT_PATH` 变量值

```
# 项目根路径配置
# 在不同服务器上部署时，需要修改为实际的项目根路径
PROJECT_ROOT_PATH=/path/to/your/project/root
```

#### 在生产环境中设置环境变量

在生产环境中，可以通过以下方式设置环境变量：

1. 使用 `.env.production` 文件（推荐）
2. 在启动应用时通过命令行设置环境变量：

```bash
PROJECT_ROOT_PATH=/path/to/your/project/root npm start
```

3. 在服务器的环境配置中设置（如使用 PM2、Docker 等）

## 开发说明

### 内容编辑功能

内容编辑页面位于 `app/admin/content/` 目录下，包括：

- 首页内容编辑：`app/admin/content/home/page.tsx`
- 会议介绍内容编辑：`app/admin/content/conference/page.tsx`
- 论文征稿内容编辑：`app/admin/content/papers/page.tsx`
- 注册报名内容编辑：`app/admin/content/register/page.tsx`

这些页面通过调用后端 API（`/api/readFile` 和 `/api/saveFile`）来读取和保存文件内容。API 调用需要认证令牌，并且文件路径使用了环境变量配置的项目根路径。

### 后端 API

- `/api/readFile`：读取文件内容，需要提供文件路径参数
- `/api/saveFile`：保存文件内容，需要提供文件路径和内容

这两个 API 都需要认证令牌，通过请求头中的 `Authorization` 字段传递。