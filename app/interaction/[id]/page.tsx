'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuestionDetail from '@/components/interaction/QuestionDetail';
import { isLoggedIn, questionsAPI } from '@/services/api';
import styles from '../interaction.module.css';

type QuestionDetailPageProps = {
  params: {
    id: string;
  };
};

export default function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isLoggedIn();
      setIsAuthenticated(loggedIn);
    };
    
    checkAuth();
  }, []);
  
  // 验证问题ID是否有效
  useEffect(() => {
    const validateQuestion = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 尝试获取问题详情，如果不存在会抛出错误
        await questionsAPI.getQuestionDetail(Number(params.id));
        setIsLoading(false);
      } catch (err) {
        setError('问题不存在或已被删除');
        setIsLoading(false);
      }
    };
    
    validateQuestion();
  }, [params.id]);
  
  // 处理返回问题列表
  const handleBackToList = () => {
    router.push('/interaction');
  };
  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>加载中...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <button 
          className={styles.backButton}
          onClick={handleBackToList}
        >
          返回问题列表
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.interactionContainer}>
      <div className={styles.interactionHeader}>
        <div className={styles.breadcrumbs}>
          <Link href="/interaction" className={styles.breadcrumbLink}>
            互动交流区
          </Link>
          <span className={styles.breadcrumbSeparator}>&gt;</span>
          <span className={styles.breadcrumbCurrent}>问题详情</span>
        </div>
      </div>
      
      <div className={styles.interactionContent}>
        <QuestionDetail 
          questionId={Number(params.id)} 
        />
      </div>
    </div>
  );
}