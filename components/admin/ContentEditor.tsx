'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn } from '@/services/api';
import styles from './ContentEditor.module.css';

interface ContentEditorProps {
  pageTitle: string;
  pageId: string;
  filePath: string; // 页面文件的路径
  onSave: (pageId: string, content: string, editPath: string) => Promise<void>;
  onLoad: (filePath: string) => Promise<string>;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  pageTitle,
  pageId,
  filePath,
  onSave,
  onLoad
}) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isLoggedIn();
      setIsAuthenticated(loggedIn);
      
      // 如果未登录，重定向到登录页面
      if (!loggedIn) {
        router.push(`/login?redirect=/admin/content/${pageId}`);
      } else {
        loadContent();
      }
    };
    
    checkAuth();
  }, [router, pageId, filePath]);

  // 控制消息显示的动画效果
  useEffect(() => {
    if (saveMessage) {
      setShowMessage(true);
      
      // 3秒后开始淡出动画
      const timer = setTimeout(() => {
        setShowMessage(false);
        
        // 动画结束后清除消息
        setTimeout(() => {
          setSaveMessage(null);
        }, 300); // 与CSS动画时间匹配
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // 加载内容
  const loadContent = async () => {
    setIsLoading(true);
    try {
      // 构建编辑目录路径
      const editPath = filePath.replace('/app/', '/edit/app/');
      
      // 首先尝试从edit目录加载文件
      try {
        const fileContent = await onLoad(editPath);
        setContent(fileContent);
      } catch (error) {
        // 如果从edit目录加载失败，则从原始路径加载
        console.log('从edit目录加载失败，尝试从原始路径加载:', error);
        const fileContent = await onLoad(filePath);
        setContent(fileContent);
      }
    } catch (error) {
      console.error('加载内容失败:', error);
      setSaveMessage({ type: 'error', text: '加载文件内容失败，请重试！' });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理内容变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 保存内容
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // 构建编辑目录路径
      const editPath = filePath.replace('/app/', '/edit/app/');
      await onSave(pageId, content, editPath);
      setSaveMessage({ type: 'success', text: '内容已成功保存！' });
    } catch (error) {
      console.error('保存内容失败:', error);
      setSaveMessage({ type: 'error', text: '保存失败，请重试！' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <h1>{pageTitle} - 内容编辑</h1>
          <Link href="/admin" className={styles.backLink}>返回管理页面</Link>
        </div>
        <div className={styles.loadingState}>加载内容中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 已经重定向到登录页面，不需要渲染内容
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h1>{pageTitle} - 内容编辑</h1>
        <Link href="/admin" className={styles.backLink}>返回管理页面</Link>
      </div>
      
      {saveMessage && (
        <div className={`${styles.saveMessage} ${styles[saveMessage.type]} ${showMessage ? styles.show : styles.hide}`}>
          <div className={styles.messageContent}>
            {saveMessage.type === 'success' && (
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
              </svg>
            )}
            {saveMessage.type === 'error' && (
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
              </svg>
            )}
            <span>{saveMessage.text}</span>
          </div>
        </div>
      )}
      
      <div className={styles.filePathInfo}>
        <strong>文件路径:</strong> {filePath}
        <div className={styles.editPathInfo}>
          <strong>编辑路径:</strong> {filePath.replace('/app/', '/edit/app/')}
        </div>
      </div>
      
      <div className={styles.fileEditor}>
        <textarea
          value={content}
          onChange={handleContentChange}
          rows={30}
          className={styles.codeEditor}
          disabled={isSaving}
          spellCheck={false}
        />
      </div>
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.saveButton} 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving ? '保存中...' : '保存更改'}
        </button>
        <Link href="/admin" className={styles.cancelButton}>取消</Link>
      </div>
    </div>
  );
};

export default ContentEditor;