'use client';

import { useState } from 'react';
import { authAPI } from '@/services/api';
import styles from './Auth.module.css';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onRegister }) => {
  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
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
    
    // 至少需要提供email或phone中的一个
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = '请提供邮箱或电话号码';
      newErrors.phone = '请提供邮箱或电话号码';
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
      // 调用登录API
      const response = await authAPI.login(formData.email || undefined, formData.phone || undefined);
      
      // 登录成功
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('登录失败:', error);
      setSubmitError(error instanceof Error ? error.message : '登录失败，邮箱或电话号码不正确');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.authFormContainer}>
      <h2 className={styles.authTitle}>参会者登录</h2>
      
      {submitError && (
        <div className={styles.errorMessage}>{submitError}</div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">邮箱</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.email ? styles.inputError : ''}
            placeholder="请输入注册时使用的邮箱"
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
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
            className={errors.phone ? styles.inputError : ''}
            placeholder="请输入注册时使用的电话号码"
          />
          {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
        </div>
        
        <div className={styles.formNote}>
          <p>请输入注册时使用的邮箱或电话号码进行登录</p>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </div>
        
        {onRegister && (
          <div className={styles.formFooter}>
            <p>还没有账号？ 
              <button 
                type="button" 
                className={styles.textButton} 
                onClick={onRegister}
                disabled={isLoading}
              >
                立即注册
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;