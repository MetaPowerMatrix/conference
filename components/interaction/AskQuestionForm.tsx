'use client';

import { useState } from 'react';
import { questionsAPI } from '@/services/api';
import styles from './Interaction.module.css';

interface AskQuestionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AskQuestionForm: React.FC<AskQuestionFormProps> = ({ onSuccess, onCancel }) => {
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  
  // 错误和加载状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  
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
  
  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '问题标题不能为空';
    } else if (formData.title.length < 5) {
      newErrors.title = '问题标题至少需要5个字符';
    } else if (formData.title.length > 100) {
      newErrors.title = '问题标题不能超过100个字符';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '问题内容不能为空';
    } else if (formData.content.length < 10) {
      newErrors.content = '问题内容至少需要10个字符';
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
      // 调用发布问题API
      await questionsAPI.postQuestion(formData);
      
      // 发布成功
      setSubmitSuccess('问题发布成功！');
      
      // 重置表单
      setFormData({
        title: '',
        content: ''
      });
      
      // 调用成功回调
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('发布问题失败:', error);
      setSubmitError(error instanceof Error ? error.message : '发布问题失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.askQuestionContainer}>
      <h2 className={styles.askQuestionTitle}>发布问题</h2>
      
      {submitError && (
        <div className={styles.errorMessage}>{submitError}</div>
      )}
      
      {submitSuccess && (
        <div className={styles.successMessage}>{submitSuccess}</div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.askQuestionForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">问题标题 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="请输入问题标题（5-100个字符）"
            className={errors.title ? styles.inputError : ''}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content">问题内容 *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            disabled={isLoading}
            rows={8}
            placeholder="请详细描述您的问题，以便其他参会者能够更好地理解和回答"
            className={`${styles.textArea} ${errors.content ? styles.inputError : ''}`}
          />
          {errors.content && <span className={styles.errorText}>{errors.content}</span>}
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading}
          >
            {isLoading ? '发布中...' : '发布问题'}
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

export default AskQuestionForm;