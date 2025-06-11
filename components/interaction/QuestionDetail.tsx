'use client';

import { useState, useEffect } from 'react';
import { questionsAPI, isLoggedIn } from '@/services/api';
import Link from 'next/link';
import styles from './Interaction.module.css';

interface Question {
  id: number;
  title: string;
  content: string;
  post_date: string;
  user_id: number;
  username: string;
}

interface Answer {
  id: number;
  content: string;
  post_date: string;
  user_id: number;
  username: string;
}

interface QuestionDetailProps {
  questionId: number;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({ questionId }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  
  // 加载问题详情和回答
  const loadQuestionDetails = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await questionsAPI.getQuestionDetail(questionId);
      setQuestion(data.question);
      setAnswers(data.answers);
    } catch (err) {
      console.error('获取问题详情失败:', err);
      setError('获取问题详情失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    loadQuestionDetails();
  }, [questionId]);
  
  // 处理回答内容变化
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewAnswer(e.target.value);
    if (submitError) setSubmitError('');
  };
  
  // 提交回答
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAnswer.trim()) {
      setSubmitError('回答内容不能为空');
      return;
    }
    
    if (!isLoggedIn()) {
      setSubmitError('请先登录后再回答问题');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      await questionsAPI.postAnswer(questionId, newAnswer);
      setSubmitSuccess('回答发布成功！');
      setNewAnswer('');
      
      // 重新加载回答列表
      loadQuestionDetails();
    } catch (err) {
      console.error('发布回答失败:', err);
      setSubmitError(err instanceof Error ? err.message : '发布回答失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
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
        <Link href="/interaction" className={styles.backButton}>
          返回问题列表
        </Link>
      </div>
    );
  }
  
  if (!question) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>问题不存在或已被删除</div>
        <Link href="/interaction" className={styles.backButton}>
          返回问题列表
        </Link>
      </div>
    );
  }
  
  return (
    <div className={styles.questionDetailContainer}>
      <div className={styles.questionDetailHeader}>
        <Link href="/interaction" className={styles.backLink}>
          &larr; 返回问题列表
        </Link>
      </div>
      
      <div className={styles.questionDetailCard}>
        <h1 className={styles.questionDetailTitle}>{question.title}</h1>
        
        <div className={styles.questionDetailMeta}>
          <span className={styles.questionDetailAuthor}>
            提问者: {question.username}
          </span>
          <span className={styles.questionDetailDate}>
            发布于: {formatDate(question.post_date)}
          </span>
        </div>
        
        <div className={styles.questionDetailContent}>
          <p>{question.content}</p>
        </div>
      </div>
      
      <div className={styles.answersSection}>
        <h2 className={styles.answersSectionTitle}>
          回答 ({answers.length})
        </h2>
        
        {answers.length === 0 ? (
          <div className={styles.noAnswers}>
            <p>暂无回答，成为第一个回答的人吧！</p>
          </div>
        ) : (
          <div className={styles.answersList}>
            {answers.map(answer => (
              <div key={answer.id} className={styles.answerCard}>
                <div className={styles.answerCardHeader}>
                  <span className={styles.answerAuthor}>
                    {answer.username}
                  </span>
                  <span className={styles.answerDate}>
                    {formatDate(answer.post_date)}
                  </span>
                </div>
                
                <div className={styles.answerCardContent}>
                  <p>{answer.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.answerFormSection}>
        <h3 className={styles.answerFormTitle}>发表回答</h3>
        
        {submitError && (
          <div className={styles.errorMessage}>{submitError}</div>
        )}
        
        {submitSuccess && (
          <div className={styles.successMessage}>{submitSuccess}</div>
        )}
        
        <form onSubmit={handleSubmitAnswer} className={styles.answerForm}>
          <div className={styles.formGroup}>
            <textarea
              className={styles.answerTextarea}
              value={newAnswer}
              onChange={handleAnswerChange}
              placeholder="请输入您的回答..."
              rows={6}
              disabled={isSubmitting}
            />
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={isSubmitting || !newAnswer.trim()}
            >
              {isSubmitting ? '提交中...' : '提交回答'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionDetail;