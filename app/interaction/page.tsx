'use client'

import { useState } from 'react'
import styles from './interaction.module.css'
import QuestionsList from '@/components/interaction/QuestionsList'
import AskQuestionForm from '@/components/interaction/AskQuestionForm'

export default function Interaction() {
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [questionsCount, setQuestionsCount] = useState(0)

  // 处理问题提交成功后的回调
  const handleQuestionSuccess = () => {
    setShowQuestionForm(false)
    // 刷新问题列表
  }

  // 更新问题计数
  const updateQuestionsCount = (count: number) => {
    setQuestionsCount(count)
  }

  return (
    <div className={styles.interactionPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="section-title">互动交流</h1>
          <p className="section-subtitle">
            与全球医学专家在线交流，分享学术见解，解答专业问题
          </p>
        </div>
      </section>

      {/* Social Features */}
      <section className={styles.socialSection}>
        <div className="container">
          <div className={styles.socialGrid}>
            <div className="card">
              <h3>🤔 问答社区</h3>
              <p>提出专业问题，获得专家解答</p>
              <div className={styles.stats}>已解答 {questionsCount} 个问题</div>
            </div>
            <div className="card">
              <h3>💬 学术讨论</h3>
              <p>参与热门话题讨论，分享观点</p>
              <div className={styles.stats}>活跃用户 1,234 人</div>
            </div>
            <div className="card">
              <h3>🔗 LinkedIn交流</h3>
              <p>连接全球医学专业人士</p>
              <div className={styles.stats}>专业网络 5,678 人</div>
            </div>
          </div>
        </div>
      </section>

      {/* Q&A Section */}
      <section className={styles.qaSection}>
        <div className="container">
          {/* 问题表单模态框 */}
          {showQuestionForm && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>提出问题</h3>
                  <button 
                    className={styles.closeBtn}
                    onClick={() => setShowQuestionForm(false)}
                  >
                    ×
                  </button>
                </div>
                <AskQuestionForm 
                  onSuccess={handleQuestionSuccess} 
                  onCancel={() => setShowQuestionForm(false)} 
                />
              </div>
            </div>
          )}

          {/* 问题列表组件 */}
          <QuestionsList onAskQuestion={() => setShowQuestionForm(true)} />
        </div>
      </section>
    </div>
  )
}