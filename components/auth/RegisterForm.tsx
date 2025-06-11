'use client';

import { useState } from 'react';
import { authAPI } from '@/services/api';
import styles from './Auth.module.css';

interface RegisterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onCancel }) => {
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    full_name: '',
    affiliation: '',
    title: '',
    phone: ''
  });
  
  // 错误和加载状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    if (!formData.email) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = '姓名不能为空';
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
    
    try {
      // 调用注册API
      const { confirmPassword, ...registerData } = formData;
      await authAPI.register(registerData);
      
      // 注册成功
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('注册失败:', error);
      setSubmitError(error instanceof Error ? error.message : '注册失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.authFormContainer}>
      <h2 className={styles.authTitle}>参会者注册</h2>
      
      {submitError && (
        <div className={styles.errorMessage}>{submitError}</div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">用户名 *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.username ? styles.inputError : ''}
          />
          {errors.username && <span className={styles.errorText}>{errors.username}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">密码 *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.password ? styles.inputError : ''}
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">确认密码 *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.confirmPassword ? styles.inputError : ''}
          />
          {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">邮箱 *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.email ? styles.inputError : ''}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="full_name">姓名 *</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.full_name ? styles.inputError : ''}
          />
          {errors.full_name && <span className={styles.errorText}>{errors.full_name}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="affiliation">所属机构</label>
          <input
            type="text"
            id="affiliation"
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="title">职称</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="phone">电话号码</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading}
          >
            {isLoading ? '注册中...' : '注册'}
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

export default RegisterForm;