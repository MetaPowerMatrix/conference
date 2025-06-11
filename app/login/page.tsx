'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { isLoggedIn } from '@/services/api';
import styles from './auth.module.css';

enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register'
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  
  // 获取重定向URL
  const redirectUrl = searchParams.get('redirect') || '/';
  
  // 检查用户是否已登录
  useEffect(() => {
    if (isLoggedIn()) {
      router.push(redirectUrl);
    }
  }, [router, redirectUrl]);
  
  // 切换认证模式
  const toggleAuthMode = () => {
    setAuthMode(authMode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
  };
  
  // 处理认证成功
  const handleAuthSuccess = () => {
    router.push(redirectUrl);
  };
  
  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Link href="/" className={styles.logoLink}>
            <h1 className={styles.logo}>医学学术会议</h1>
          </Link>
          <p className={styles.authDescription}>
            {authMode === AuthMode.LOGIN 
              ? '登录您的账号，参与学术交流' 
              : '注册新账号，加入学术社区'}
          </p>
        </div>
        
        <div className={styles.authContent}>
          {authMode === AuthMode.LOGIN ? (
            <LoginForm 
              onSuccess={handleAuthSuccess}
              onRegister={toggleAuthMode}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess}
              onCancel={toggleAuthMode}
            />
          )}
        </div>
        
        <div className={styles.authFooter}>
          {authMode === AuthMode.LOGIN ? (
            <p>
              还没有账号？ 
              <button 
                className={styles.authToggleButton}
                onClick={toggleAuthMode}
              >
                立即注册
              </button>
            </p>
          ) : (
            <p>
              已有账号？ 
              <button 
                className={styles.authToggleButton}
                onClick={toggleAuthMode}
              >
                去登录
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}