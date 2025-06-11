'use client';

import { useState, useEffect } from 'react';
import { papersAPI } from '@/services/api';
import styles from './Papers.module.css';

interface Paper {
  id: number;
  title: string;
  abstract?: string;
  keywords?: string;
  file_path?: string;
  original_filename?: string;
  filename?: string; // 服务器返回的字段名
  upload_date?: string;
  uploaded_at?: string; // 服务器返回的字段名
}

interface PapersListProps {
  onUploadClick?: () => void;
}

const PapersList: React.FC<PapersListProps> = ({ onUploadClick }) => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPaper, setExpandedPaper] = useState<number | null>(null);
  
  // 加载论文列表
  const loadPapers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await papersAPI.getUserPapers();
      // 修复：使用data.papers而不是直接使用data
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
  
  // 初始加载
  useEffect(() => {
    loadPapers();
  }, []);
  
  // 切换展开/折叠论文详情
  const toggleExpand = (paperId: number) => {
    setExpandedPaper(expandedPaper === paperId ? null : paperId);
  };
  
  // 下载论文
  const handleDownload = (paperId: number) => {
    try {
      papersAPI.downloadPaper(paperId);
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
    <div className={styles.papersListContainer}>
      <div className={styles.papersHeader}>
        <h2 className={styles.papersTitle}>我的论文</h2>
        {onUploadClick && (
          <button 
            className={styles.uploadButton}
            onClick={onUploadClick}
          >
            上传新论文
          </button>
        )}
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>加载中...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>您还没有上传任何论文</p>
          {onUploadClick && (
            <button 
              className={styles.emptyStateButton}
              onClick={onUploadClick}
            >
              上传第一篇论文
            </button>
          )}
        </div>
      ) : (
        <div className={styles.papersList}>
          {papers.map(paper => (
            <div key={paper.id} className={styles.paperCard}>
              <div className={styles.paperCardHeader}>
                <h3 className={styles.paperCardTitle}>{paper.title}</h3>
                <div className={styles.paperCardActions}>
                  <button 
                    className={styles.paperActionButton}
                    onClick={() => toggleExpand(paper.id)}
                    aria-label={expandedPaper === paper.id ? "收起详情" : "展开详情"}
                  >
                    {expandedPaper === paper.id ? '收起' : '详情'}
                  </button>
                  <button 
                    className={`${styles.paperActionButton} ${styles.downloadButton}`}
                    onClick={() => handleDownload(paper.id)}
                    aria-label="下载论文"
                  >
                    下载
                  </button>
                </div>
              </div>
              
              <div className={styles.paperCardMeta}>
                <span className={styles.paperFileName}>
                  文件名: {paper.original_filename || paper.filename}
                </span>
                <span className={styles.paperUploadDate}>
                  上传时间: {formatDate(paper.upload_date || paper.uploaded_at || '')}
                </span>
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
  );
};

export default PapersList;