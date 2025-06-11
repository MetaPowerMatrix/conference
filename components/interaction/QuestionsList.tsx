'use client';

import { useState, useEffect } from 'react';
import { questionsAPI } from '@/services/api';
import Link from 'next/link';
import styles from './Interaction.module.css';

interface Question {
  id: number;
  title: string;
  content: string;
  post_date: string;
  user_id: number;
  username: string;
  answers_count: number;
}

interface PaginationData {
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

interface QuestionsListProps {
  onAskQuestion?: () => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({ onAskQuestion }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    per_page: 10,
    pages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 加载问题列表
  const loadQuestions = async (page = 1) => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await questionsAPI.getQuestions();
      setQuestions(data.questions);
      setPagination({
        total: data.total,
        page: data.page,
        per_page: data.per_page,
        pages: data.pages
      });
    } catch (err) {
      console.error('获取问题列表失败:', err);
      setError('获取问题列表失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    loadQuestions();
  }, []);
  
  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      loadQuestions(newPage);
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
  
  // 生成分页按钮
  const renderPagination = () => {
    if (pagination.pages <= 1) return null;
    
    const pageButtons = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;
    
    // 添加上一页按钮
    pageButtons.push(
      <button
        key="prev"
        className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        上一页
      </button>
    );
    
    // 添加页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // 第一页
    if (startPage > 1) {
      pageButtons.push(
        <button
          key={1}
          className={`${styles.paginationButton} ${1 === currentPage ? styles.paginationButtonActive : ''}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className={styles.paginationEllipsis}>...</span>
        );
      }
    }
    
    // 页码按钮
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`${styles.paginationButton} ${i === currentPage ? styles.paginationButtonActive : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // 最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className={styles.paginationEllipsis}>...</span>
        );
      }
      
      pageButtons.push(
        <button
          key={totalPages}
          className={`${styles.paginationButton} ${totalPages === currentPage ? styles.paginationButtonActive : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    // 添加下一页按钮
    pageButtons.push(
      <button
        key="next"
        className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        下一页
      </button>
    );
    
    return (
      <div className={styles.paginationContainer}>
        {pageButtons}
      </div>
    );
  };
  
  return (
    <div className={styles.questionsListContainer}>
      <div className={styles.questionsHeader}>
        <h2 className={styles.questionsTitle}>互动交流区</h2>
        {onAskQuestion && (
          <button 
            className={styles.askButton}
            onClick={onAskQuestion}
          >
            发布问题
          </button>
        )}
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>加载中...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>暂无问题，成为第一个提问的人吧！</p>
          {onAskQuestion && (
            <button 
              className={styles.emptyStateButton}
              onClick={onAskQuestion}
            >
              发布第一个问题
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.questionsList}>
            {questions.map(question => (
              <div key={question.id} className={styles.questionCard}>
                <div className={styles.questionCardHeader}>
                  <Link href={`/interaction/questions/${question.id}`} className={styles.questionLink}>
                    <h3 className={styles.questionCardTitle}>{question.title}</h3>
                  </Link>
                  <div className={styles.questionMeta}>
                    <span className={styles.questionAuthor}>
                      提问者: {question.username}
                    </span>
                    <span className={styles.questionDate}>
                      发布于: {formatDate(question.post_date)}
                    </span>
                    <span className={styles.answerCount}>
                      回答: {question.answers_count || 0}
                    </span>
                  </div>
                </div>
                
                <div className={styles.questionCardContent}>
                  <p>{question.content.length > 200 ? `${question.content.substring(0, 200)}...` : question.content}</p>
                </div>
                
                <div className={styles.questionCardFooter}>
                  <Link href={`/interaction/${question.id}`} className={styles.viewDetailButton}>
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default QuestionsList;