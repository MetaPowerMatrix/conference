'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';
import { getAdminToken, getAdminInfo, request } from '@/services/api';

interface Paper {
  id: number;
  title: string;
  abstract?: string;
  keywords?: string;
  file_path?: string;
  original_filename?: string;
  uploaded_at: string;
  user_id: number;
  user_name?: string;
}

export default function AdminPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPaper, setExpandedPaper] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 检查管理员是否已登录
    const token = getAdminToken();
    const admin = getAdminInfo();

    if (!token || !admin) {
      // 未登录，重定向到登录页面
      router.replace('/admin/login');
      return;
    }

    // 加载论文列表
    loadPapers();
  }, [router]);

  const loadPapers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 调用API获取所有论文列表
      const data = await request('/admin/papers', {
        method: 'GET',
      });
      
      if (data && data.papers && Array.isArray(data.papers)) {
        setPapers(data.papers);
      } else {
        console.error('获取论文列表格式错误:', data);
        setPapers([]);
        setError('获取论文列表失败，数据格式错误');
      }
    } catch (err) {
      console.error('获取论文列表失败:', err);
      setError('获取论文列表失败，请稍后重试');
      setPapers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除论文
  const handleDeletePaper = async (paperId: number) => {
    if (!confirm('确定要删除这篇论文吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      // 调用API删除论文
      await request(`/admin/papers/${paperId}`, {
        method: 'DELETE',
      });
      
      // 从列表中移除已删除的论文
      setPapers(papers.filter(paper => paper.id !== paperId));
      alert('论文删除成功');
    } catch (err) {
      console.error('删除论文失败:', err);
      alert('删除论文失败，请稍后重试');
    }
  };
  // 切换展开/折叠论文详情
  const toggleExpand = (paperId: number) => {
    setExpandedPaper(expandedPaper === paperId ? null : paperId);
  };

  // 下载论文
  const handleDownload = (paperId: number) => {
    try {
      const token = getAdminToken();
      window.open(`http://localhost:5001/api/papers/download/${paperId}?token=${token}`, '_blank');
    } catch (err) {
      console.error('下载论文失败:', err);
      alert('下载论文失败，请稍后重试');
    }
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

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>论文管理</h1>
        <Link href="/admin" className={styles.backButton}>返回管理首页</Link>
      </header>

      <main className={styles.main}>
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>所有论文</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loading}></div>
              <p>加载中...</p>
            </div>
          ) : papers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>暂无论文数据</p>
            </div>
          ) : (
            <div className={styles.papersList}>
              {papers.map(paper => (
                <div key={paper.id} className={styles.paperCard}>
                  <div className={styles.paperCardHeader}>
                    <h3 className={styles.paperCardTitle}>{paper.title}</h3>
                    <div className={styles.paperCardActions}>
                      <button 
                        className={styles.actionButton}
                        onClick={() => toggleExpand(paper.id)}
                      >
                        {expandedPaper === paper.id ? '收起' : '详情'}
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => handleDownload(paper.id)}
                      >
                        下载
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeletePaper(paper.id)}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.paperCardMeta}>
                    <span>作者: {paper.user_name || `用户ID: ${paper.user_id}`}</span>
                    <span>文件名: {paper.original_filename}</span>
                    <span>上传时间: {formatDate(paper.uploaded_at)}</span>
                  </div>
                  
                  {expandedPaper === paper.id && (
                    <div className={styles.paperCardDetails}>
                      {paper.abstract && (
                        <div className={styles.paperAbstract}>
                          <h4>摘要</h4>
                          <p>{paper.abstract}</p>
                        </div>
                      )}
                      
                      {paper.keywords && (
                        <div className={styles.paperKeywords}>
                          <h4>关键词</h4>
                          <p>{paper.keywords}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}