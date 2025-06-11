'use client';

import { useState } from 'react';
import ContentEditor from '@/components/admin/ContentEditor';
import { contentAPI } from '@/services/api';
import fs from 'fs/promises';
import { getAuthToken } from '@/services/api';

// 后端API基础URL
const API_BASE_URL = 'http://localhost:5001/api';

// 项目根路径配置
const PROJECT_ROOT_PATH = process.env.PROJECT_ROOT_PATH || '';

export default function ConferenceContentPage() {
  // 页面文件路径，使用配置的项目根路径
  const filePath = `${PROJECT_ROOT_PATH}/code/app/conference/page.tsx`;
  
  // 加载内容
  const loadContent = async (path: string) => {
    try {
      // 获取认证令牌
      const token = getAuthToken();
      
      // 调用后端API端点来读取文件内容
      return await fetch(`${API_BASE_URL}/readFile?path=${encodeURIComponent(path)}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      }).then(res => {
        if (!res.ok) {
          throw new Error(`读取文件失败: ${res.statusText}`);
        }
        return res.text();
      });
    } catch (error) {
      console.error('加载文件内容失败:', error);
      throw error;
    }
  };

  // 保存内容
  const saveContent = async (pageId: string, content: string, editPath: string) => {
    try {
      // 获取认证令牌
      const token = getAuthToken();
      
      // 调用后端API端点来保存文件内容
      const response = await fetch(`${API_BASE_URL}/saveFile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ path: editPath, content }),
      });
      
      if (!response.ok) {
        throw new Error(`保存文件失败: ${response.statusText}`);
      }
    } catch (error) {
      console.error('保存文件内容失败:', error);
      throw error;
    }
  };

  return (
    <ContentEditor
      pageTitle="会议介绍"
      pageId="conference"
      filePath={filePath}
      onSave={saveContent}
      onLoad={loadContent}
    />
  );
}