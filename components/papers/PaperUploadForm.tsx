'use client';

import { useState, useRef, useEffect } from 'react';
import { papersAPI, getUserInfo, isUserLoggedIn } from '@/services/api';
import styles from './Papers.module.css';

interface PaperUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PaperUploadForm: React.FC<PaperUploadFormProps> = ({ onSuccess, onCancel }) => {
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: ''
  });
  
  // 文件状态
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 错误和加载状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  
  // 用户登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // 检查用户登录状态
  useEffect(() => {
    const loggedIn = isUserLoggedIn();
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      const user = getUserInfo();
      setUserInfo(user);
    }
  }, []);
  
  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    // 清除文件错误
    if (errors.file && selectedFile) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      });
    }
  };
  
  // 触发文件选择对话框
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 检查用户是否登录
    if (!isLoggedIn) {
      newErrors.auth = '请先登录后再上传论文';
      return false;
    }
    
    if (!formData.title.trim()) {
      newErrors.title = '论文标题不能为空';
    }
    
    if (!file) {
      newErrors.file = '请选择要上传的论文文件';
    } else {
      // 检查文件类型
      const fileType = file.type;
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(fileType)) {
        newErrors.file = '只支持PDF、DOC或DOCX格式的文件';
      }
      
      // 检查文件大小（最大10MB）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        newErrors.file = '文件大小不能超过10MB';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      // 调用上传API
      if (file) {
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('title', formData.title);
        formDataObj.append('abstract', formData.abstract);
        formDataObj.append('keywords', formData.keywords);
        
        await papersAPI.uploadPaper(formDataObj);
      }
      
      // 上传成功
      setSubmitSuccess('论文上传成功！');
      
      // 重置表单
      setFormData({
        title: '',
        abstract: '',
        keywords: ''
      });
      setFile(null);
      
      // 调用成功回调
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('上传失败:', error);
      setSubmitError(error instanceof Error ? error.message : '论文上传失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 如果用户未登录，显示提示信息
  if (!isLoggedIn) {
    return (
      <div className={styles.paperFormContainer}>
        <h2 className={styles.paperTitle}>上传论文</h2>
        <div className={styles.errorMessage}>
          您需要先登录才能上传论文。
          <div className={styles.loginPrompt}>
            <a href="/login" className={styles.loginLink}>前往登录</a>
            <span className={styles.registerPrompt}>还没有账号？<a href="/register" className={styles.registerLink}>立即注册</a></span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.paperFormContainer}>
      <h2 className={styles.paperTitle}>上传论文</h2>
      
      {submitError && (
        <div className={styles.errorMessage}>{submitError}</div>
      )}
      
      {submitSuccess && (
        <div className={styles.successMessage}>{submitSuccess}</div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.paperForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">论文标题 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.title ? styles.inputError : ''}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="abstract">摘要</label>
          <textarea
            id="abstract"
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            disabled={isLoading}
            rows={4}
            className={styles.textArea}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="keywords">关键词</label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="用逗号分隔多个关键词"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>论文文件 *</label>
          <div className={styles.fileUploadContainer}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              disabled={isLoading}
            />
            <div className={styles.fileInputGroup}>
              <input
                type="text"
                value={file ? file.name : ''}
                readOnly
                placeholder="未选择文件"
                className={`${styles.fileNameInput} ${errors.file ? styles.inputError : ''}`}
              />
              <button
                type="button"
                onClick={handleBrowseClick}
                className={styles.browseButton}
                disabled={isLoading}
              >
                浏览...
              </button>
            </div>
            {errors.file && <span className={styles.errorText}>{errors.file}</span>}
            <p className={styles.fileHelpText}>支持PDF、DOC或DOCX格式，文件大小不超过10MB</p>
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading}
          >
            {isLoading ? '上传中...' : '上传论文'}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onCancel}
              disabled={isLoading}
            >
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaperUploadForm;