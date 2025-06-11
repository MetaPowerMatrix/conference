'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../admin.module.css';
import { getAdminToken, getAdminInfo, adminAPI } from '@/services/api';

interface Question {
  id: number;
  title: string;
  content: string;
  post_date: string;
  user_id: number;
  username: string;
  answer_count: number;
}

interface Answer {
  id: number;
  content: string;
  post_date: string;
  user_id: number;
  username: string;
}

export default function AllQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: Answer[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteStatus, setDeleteStatus] = useState<{id: number, type: string, status: string} | null>(null);
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

    // 加载问题列表
    loadQuestions();
  }, [router]);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 调用API获取所有问题列表
      const data = await adminAPI.getAllQuestions();
      
      if (data && data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        console.error('获取问题列表格式错误:', data);
        setQuestions([]);
        setError('获取问题列表失败，数据格式错误');
      }
    } catch (err) {
      console.error('获取问题列表失败:', err);
      setError('获取问题列表失败，请稍后重试');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnswers = async (questionId: number) => {
    try {
      // 调用API获取问题的回答列表
      const response = await fetch(`/api/questions/${questionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.answers && Array.isArray(data.answers)) {
        // 将后端返回的created_at字段映射为前端使用的post_date字段
        const formattedAnswers = data.answers.map((answer: any) => ({
          ...answer,
          post_date: answer.created_at,
          username: answer.user?.full_name || answer.user?.username || '未知用户'
        }));
        
        setAnswers(prev => ({
          ...prev,
          [questionId]: formattedAnswers
        }));
      } else {
        console.error('获取回答列表格式错误:', data);
        setAnswers(prev => ({
          ...prev,
          [questionId]: []
        }));
      }
    } catch (err) {
      console.error(`获取问题ID ${questionId} 的回答失败:`, err);
      setAnswers(prev => ({
        ...prev,
        [questionId]: []
      }));
    }
  };

  // 切换展开/折叠问题详情
  const toggleExpand = async (questionId: number) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
      // 如果还没有加载这个问题的回答，则加载
      if (!answers[questionId]) {
        await loadAnswers(questionId);
      }
    }
  };

  // 删除问题
  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm('确定要删除这个问题吗？此操作不可恢复，问题下的所有回答也将被删除。')) {
      return;
    }
    
    setDeleteStatus({id: questionId, type: 'question', status: 'loading'});
    
    try {
      // 调用API删除问题
      await adminAPI.deleteQuestion(questionId);
      
      // 从列表中移除已删除的问题
      setQuestions(questions.filter(q => q.id !== questionId));
      setDeleteStatus({id: questionId, type: 'question', status: 'success'});
      
      // 3秒后清除状态
      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
    } catch (err) {
      console.error('删除问题失败:', err);
      setDeleteStatus({id: questionId, type: 'question', status: 'error'});
      
      // 3秒后清除状态
      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
    }
  };

  // 删除回答
  const handleDeleteAnswer = async (questionId: number, answerId: number) => {
    if (!confirm('确定要删除这个回答吗？此操作不可恢复。')) {
      return;
    }
    
    setDeleteStatus({id: answerId, type: 'answer', status: 'loading'});
    
    try {
      // 调用API删除回答
      await adminAPI.deleteAnswer(answerId);
      
      // 从列表中移除已删除的回答
      setAnswers(prev => ({
        ...prev,
        [questionId]: prev[questionId].filter(a => a.id !== answerId)
      }));
      
      // 更新问题的回答计数
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return {...q, answer_count: q.answer_count - 1};
        }
        return q;
      }));
      
      setDeleteStatus({id: answerId, type: 'answer', status: 'success'});
      
      // 3秒后清除状态
      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
    } catch (err) {
      console.error('删除回答失败:', err);
      setDeleteStatus({id: answerId, type: 'answer', status: 'error'});
      
      // 3秒后清除状态
      setTimeout(() => {
        setDeleteStatus(null);
      }, 3000);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>全部问答数据</h1>
        <div>
          <Link href="/admin" className={styles.backButton} style={{ marginRight: '10px' }}>返回管理首页</Link>
          <Link href="/admin/questions" className={styles.backButton}>返回问答管理</Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>所有问题和回答</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loading}></div>
              <p>加载中...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className={styles.emptyState}>
              <p>暂无问题数据</p>
            </div>
          ) : (
            <div className={styles.questionsList}>
              {questions.map(question => (
                <div key={question.id} className={styles.questionCard}>
                  <div className={styles.questionCardHeader}>
                    <h3 className={styles.questionCardTitle}>{question.title}</h3>
                    <div className={styles.questionCardActions}>
                      <button 
                        className={styles.actionButton}
                        onClick={() => toggleExpand(question.id)}
                      >
                        {expandedQuestion === question.id ? '收起' : '详情'}
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={deleteStatus?.id === question.id && deleteStatus?.type === 'question' && deleteStatus?.status === 'loading'}
                      >
                        {deleteStatus?.id === question.id && deleteStatus?.type === 'question' && deleteStatus?.status === 'loading' ? '删除中...' : '删除'}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.questionCardMeta}>
                    <span>提问者: {question.username}</span>
                    <span>发布时间: {formatDate(question.post_date)}</span>
                    <span>回答数: {question.answer_count}</span>
                  </div>
                  
                  <div className={styles.questionCardContent}>
                    <p>{question.content}</p>
                  </div>
                  
                  {expandedQuestion === question.id && (
                    <div className={styles.answersSection}>
                      <h4 className={styles.answersSectionTitle}>回答列表</h4>
                      
                      {!answers[question.id] ? (
                        <div className={styles.loadingContainer}>
                          <div className={styles.loading}></div>
                          <p>加载回答中...</p>
                        </div>
                      ) : answers[question.id].length === 0 ? (
                        <div className={styles.emptyState}>
                          <p>暂无回答</p>
                        </div>
                      ) : (
                        <div className={styles.answersList}>
                          {answers[question.id].map(answer => (
                            <div key={answer.id} className={styles.answerCard}>
                              <div className={styles.answerCardHeader}>
                                <div className={styles.answerCardMeta}>
                                  <span>回答者: {answer.username}</span>
                                  <span>回答时间: {formatDate(answer.post_date)}</span>
                                </div>
                                <div className={styles.answerCardActions}>
                                  <button 
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDeleteAnswer(question.id, answer.id)}
                                    disabled={deleteStatus?.id === answer.id && deleteStatus?.type === 'answer' && deleteStatus?.status === 'loading'}
                                  >
                                    {deleteStatus?.id === answer.id && deleteStatus?.type === 'answer' && deleteStatus?.status === 'loading' ? '删除中...' : '删除'}
                                  </button>
                                </div>
                              </div>
                              
                              <div className={styles.answerCardContent}>
                                <p>{answer.content}</p>
                              </div>
                            </div>
                          ))}
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