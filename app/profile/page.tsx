'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, isLoggedIn } from '@/services/api';
import PapersList from '@/components/papers/PapersList';
import PaperUploadForm from '@/components/papers/PaperUploadForm';
import styles from './profile.module.css';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  affiliation?: string;
  title?: string;
  phone?: string;
  registration_date: string;
}

enum ProfileTab {
  INFO = 'info',
  PAPERS = 'papers',
  UPLOAD_PAPER = 'upload_paper'
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.INFO);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 检查用户是否已登录
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login?redirect=/profile');
      return;
    }
    
    loadUserProfile();
  }, [router]);
  
  // 加载用户资料
  const loadUserProfile = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await authAPI.getCurrentUser();
      setUserProfile(data);
    } catch (err) {
      console.error('获取用户资料失败:', err);
      setError('获取用户资料失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理标签切换
  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
  };
  
  // 处理论文上传成功
  const handlePaperUploadSuccess = () => {
    setActiveTab(ProfileTab.PAPERS);
  };
  
  // 处理退出登录
  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          className={styles.retryButton}
          onClick={loadUserProfile}
        >
          重试
        </button>
      </div>
    );
  }
  
  if (!userProfile) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>无法加载用户资料，请重新登录</div>
        <button 
          className={styles.retryButton}
          onClick={() => router.push('/login?redirect=/profile')}
        >
          去登录
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{userProfile.full_name}</h1>
          <p className={styles.profileUsername}>@{userProfile.username}</p>
        </div>
        <button 
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          退出登录
        </button>
      </div>
      
      <div className={styles.profileTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === ProfileTab.INFO ? styles.activeTab : ''}`}
          onClick={() => handleTabChange(ProfileTab.INFO)}
        >
          个人资料
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === ProfileTab.PAPERS ? styles.activeTab : ''}`}
          onClick={() => handleTabChange(ProfileTab.PAPERS)}
        >
          我的论文
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === ProfileTab.UPLOAD_PAPER ? styles.activeTab : ''}`}
          onClick={() => handleTabChange(ProfileTab.UPLOAD_PAPER)}
        >
          上传论文
        </button>
      </div>
      
      <div className={styles.profileContent}>
        {activeTab === ProfileTab.INFO && (
          <div className={styles.userInfoContainer}>
            <h2 className={styles.sectionTitle}>个人资料</h2>
            
            <div className={styles.userInfoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>姓名</span>
                <span className={styles.infoValue}>{userProfile.full_name}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>用户名</span>
                <span className={styles.infoValue}>{userProfile.username}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>邮箱</span>
                <span className={styles.infoValue}>{userProfile.email}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>所属机构</span>
                <span className={styles.infoValue}>{userProfile.affiliation || '未设置'}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>职称</span>
                <span className={styles.infoValue}>{userProfile.title || '未设置'}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>电话</span>
                <span className={styles.infoValue}>{userProfile.phone || '未设置'}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>注册日期</span>
                <span className={styles.infoValue}>{formatDate(userProfile.registration_date)}</span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === ProfileTab.PAPERS && (
          <PapersList 
            onUploadClick={() => handleTabChange(ProfileTab.UPLOAD_PAPER)}
          />
        )}
        
        {activeTab === ProfileTab.UPLOAD_PAPER && (
          <PaperUploadForm 
            onSuccess={handlePaperUploadSuccess}
            onCancel={() => handleTabChange(ProfileTab.PAPERS)}
          />
        )}
      </div>
    </div>
  );
}