// API服务

// 基础URL
const API_BASE_URL = 'http://localhost:5001/api';

// 认证Token存储键名
const USER_TOKEN_KEY = 'medical_conference_user_token';
const USER_INFO_KEY = 'medical_conference_user_info';
const ADMIN_TOKEN_KEY = 'medical_conference_admin_token';
const ADMIN_INFO_KEY = 'medical_conference_admin_info';

// 获取普通用户认证Token
export const getUserToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_TOKEN_KEY);
  }
  return null;
};

// 设置普通用户认证Token
export const setUserToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_TOKEN_KEY, token);
  }
};

// 清除普通用户认证Token
export const clearUserToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  }
};

// 获取管理员认证Token
export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }
  return null;
};

// 设置管理员认证Token
export const setAdminToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }
};

// 清除管理员认证Token
export const clearAdminToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_INFO_KEY);
  }
};

// 保存普通用户信息
export const setUserInfo = (userInfo: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }
};

// 获取普通用户信息
export const getUserInfo = (): any | null => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }
  return null;
};

// 保存管理员信息
export const setAdminInfo = (adminInfo: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(adminInfo));
  }
};

// 获取管理员信息
export const getAdminInfo = (): any | null => {
  if (typeof window !== 'undefined') {
    const adminInfo = localStorage.getItem(ADMIN_INFO_KEY);
    return adminInfo ? JSON.parse(adminInfo) : null;
  }
  return null;
};

// 兼容旧代码的方法
export const getAuthToken = (): string | null => {
  return getUserToken() || getAdminToken();
};

// 兼容旧代码的方法
export const setAuthToken = (token: string): void => {
  setUserToken(token);
};

// 兼容旧代码的方法
export const clearAuthToken = (): void => {
  clearUserToken();
};

// 检查普通用户是否已登录
export const isUserLoggedIn = (): boolean => {
  return !!getUserToken();
};

// 检查管理员是否已登录
export const isAdminLoggedIn = (): boolean => {
  return !!getAdminToken();
};

// 兼容旧代码的方法
export const isLoggedIn = (): boolean => {
  return isUserLoggedIn() || isAdminLoggedIn();
};

// 通用请求函数
export const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `请求失败: ${response.status}`);
  }
  
  return response.json();
};

// 文件上传请求函数
export const fileUploadRequest = async (endpoint: string, formData: FormData) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `请求失败: ${response.status}`);
  }
  
  return response.json();
};

// 认证相关API
export const authAPI = {
  // 注册
  register: async (userData: any) => {
    const data = await request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      setUserToken(data.token);
      setUserInfo(data.user);
    }
    
    return data;
  },
  
  // 普通用户登录
  login: async (email?: string, phone?: string) => {
    // 至少需要提供email或phone中的一个
    if (!email && !phone) {
      throw new Error('请提供邮箱或电话号码');
    }
    const credentials = { email, phone };
    const data = await request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      setUserToken(data.token);
      setUserInfo(data.user);
    }
    
    return data;
  },
  
  // 管理员登录
  adminLogin: async (username: string, password: string) => {
    if (!username || !password) {
      throw new Error('请提供用户名和密码');
    }
    const credentials = { username, password };
    const data = await request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      setAdminToken(data.token);
      setAdminInfo(data.user);
    }
    
    return data;
  },
  
  // 登出
  logout: () => {
    clearUserToken();
    clearAdminToken();
    // 如果在浏览器环境，重定向到首页
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
  
  // 获取当前用户信息
  getCurrentUser: async () => {
    return request('/users/me', {
      method: 'GET',
    });
  },
};

// 论文相关API
export const papersAPI = {
  // 上传论文
  uploadPaper: async (formData: FormData) => {
    return fileUploadRequest('/papers/upload', formData);
  },
  
  // 获取用户论文
  getUserPapers: async () => {
    return request('/papers/user', {
      method: 'GET',
    });
  },
  
  // 获取所有论文
  getAllPapers: async () => {
    return request('/papers/all', {
      method: 'GET',
    });
  },
  
  // 下载论文
  downloadPaper: (paperId: number) => {
    const token = getAuthToken();
    window.open(`${API_BASE_URL}/papers/download/${paperId}?token=${token}`, '_blank');
  },
};

// 问答相关API
export const questionsAPI = {
  // 发布问题
  postQuestion: async (questionData: any) => {
    return request('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },
  
  // 获取问题列表
  getQuestions: async () => {
    return request('/questions', {
      method: 'GET',
    });
  },
  
  // 获取问题详情
  getQuestionDetail: async (questionId: number) => {
    return request(`/questions/${questionId}`, {
      method: 'GET',
    });
  },
  
  // 发布回答
  postAnswer: async (questionId: number, answerContent: string) => {
    return request(`/questions/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify({ content: answerContent }),
    });
  },
};

// 内容管理API
export const contentAPI = {
  // 获取页面内容
  getPageContent: async (pageId: string) => {
    return request(`/content/${pageId}`, {
      method: 'GET',
    });
  },
  
  // 保存页面内容
  savePageContent: async (pageId: string, content: string) => {
    return request(`/content/${pageId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

// 管理员API
export const adminAPI = {
  // 获取所有用户
  getAllUsers: async () => {
    return request('/admin/users', {
      method: 'GET',
    });
  },
  
  // 删除用户
  deleteUser: async (userId: number) => {
    return request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
  
  // 获取所有论文
  getAllPapers: async () => {
    return request('/admin/papers', {
      method: 'GET',
    });
  },
  
  // 删除论文
  deletePaper: async (paperId: number) => {
    return request(`/admin/papers/${paperId}`, {
      method: 'DELETE',
    });
  },
  
  // 获取所有问题
  getAllQuestions: async () => {
    return request('/admin/questions', {
      method: 'GET',
    });
  },
  
  // 删除问题
  deleteQuestion: async (questionId: number) => {
    return request(`/admin/questions/${questionId}`, {
      method: 'DELETE',
    });
  },
  
  // 删除回答
  deleteAnswer: async (answerId: number) => {
    return request(`/admin/answers/${answerId}`, {
      method: 'DELETE',
    });
  },
};