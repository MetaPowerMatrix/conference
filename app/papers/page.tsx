'use client'

import { useState } from 'react'
import styles from './papers.module.css'
import PaperUploadForm from '@/components/papers/PaperUploadForm'
import PapersList from '@/components/papers/PapersList'

export default function Papers() {
  const [activeView, setActiveView] = useState<'list' | 'upload'>('list')

  // 切换到上传表单
  const handleShowUploadForm = () => {
    setActiveView('upload')
  }

  // 上传成功后切换回列表
  const handleUploadSuccess = () => {
    setActiveView('list')
  }

  // 取消上传返回列表
  const handleCancelUpload = () => {
    setActiveView('list')
  }

  return (
    <div className={styles.papersPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="section-title">论文征稿</h1>
          <p className="section-subtitle">
            欢迎提交您的研究成果，与全球医学专家分享学术见解
          </p>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="section">
        <div className="container">
          <div className={styles.guidelines}>
            <h2 className="section-title">征稿主题</h2>
            <div className="grid grid-2">
              <div className="card">
                <h3>🧬 精准医学</h3>
                <p>基因组学、蛋白质组学、个性化治疗、生物标志物研究等</p>
              </div>
              <div className="card">
                <h3>🤖 人工智能医疗</h3>
                <p>医学影像AI、临床决策支持、药物发现、智能诊断等</p>
              </div>
              <div className="card">
                <h3>💊 新药研发</h3>
                <p>药物设计、临床试验、药物安全性、监管科学等</p>
              </div>
              <div className="card">
                <h3>📱 数字健康</h3>
                <p>远程医疗、健康监测、医疗信息化、移动健康应用等</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Requirements */}
      <section className={styles.requirements}>
        <div className="container">
          <h2 className="section-title">提交要求</h2>
          <div className={styles.requirementsList}>
            <div className={styles.requirement}>
              <h3>📄 格式要求</h3>
              <ul>
                <li>论文格式：PDF格式，A4纸张</li>
                <li>字数限制：摘要不超过300字，正文不超过8000字</li>
                <li>语言：中文或英文</li>
                <li>字体：中文使用宋体，英文使用Times New Roman</li>
              </ul>
            </div>
            <div className={styles.requirement}>
              <h3>📝 内容要求</h3>
              <ul>
                <li>研究内容具有创新性和学术价值</li>
                <li>数据真实可靠，方法科学严谨</li>
                <li>结论明确，具有实际应用意义</li>
                <li>参考文献格式规范，引用准确</li>
              </ul>
            </div>
            <div className={styles.requirement}>
              <h3>⏰ 时间安排</h3>
              <ul>
                <li>征稿截止：2024年4月30日</li>
                <li>初审结果：2024年5月15日</li>
                <li>修改截止：2024年5月30日</li>
                <li>最终结果：2024年6月5日</li>
              </ul>
            </div>
            <div className={styles.requirement}>
              <h3>🏆 评审流程</h3>
              <ul>
                <li>初步筛选：格式和基本要求检查</li>
                <li>专家评审：双盲评审制度</li>
                <li>修改完善：根据专家意见修改</li>
                <li>最终录用：优秀论文将被推荐发表</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Form or Papers List */}
      <section className={styles.submissionSection}>
        <div className="container">
          {activeView === 'list' ? (
            <PapersList onUploadClick={handleShowUploadForm} />
          ) : (
            <PaperUploadForm onSuccess={handleUploadSuccess} onCancel={handleCancelUpload} />
          )}
        </div>
      </section>
    </div>
  )
}