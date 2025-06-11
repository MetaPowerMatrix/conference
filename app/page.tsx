'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { getUserInfo } from '@/services/api'

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  useEffect(() => {
    // 检查用户是否已登录
    const userInfo = getUserInfo()
    if (userInfo) {
      setUserLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    const targetDate = new Date('2025-10-17T09:00:00').getTime()
    
    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              2025年医学学术会议
            </h1>
            <p className={styles.heroSubtitle}>
              汇聚全球医学专家，分享前沿研究成果，推动医学科技发展
            </p>
            <div className={styles.heroMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>会议主题：</span>
                <span>精准医学与创新治疗</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>日期：</span>
                <span>2025年10月17-19日</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>地点：</span>
                <span>国际会议中心</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>创计时模块：</span>
                <span>智能诊断与数字化医疗</span>
              </div>
            </div>
            <div className={styles.heroActions}>
              {!userLoggedIn && (
                <Link href="/register" className="btn">
                  立即注册
                </Link>
              )}
              <Link href="/conference" className="btn">
                了解详情
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className={styles.countdown}>
        <div className="container">
          <h2 className="section-title">距离会议开始</h2>
          <div className={styles.countdownContainer}>
            <div className={styles.countdownItem}>
              <div className={styles.countdownNumber}>{timeLeft.days}</div>
              <div className={styles.countdownLabel}>天</div>
            </div>
            <div className={styles.countdownSeparator}>:</div>
            <div className={styles.countdownItem}>
              <div className={styles.countdownNumber}>{timeLeft.hours}</div>
              <div className={styles.countdownLabel}>时</div>
            </div>
            <div className={styles.countdownSeparator}>:</div>
            <div className={styles.countdownItem}>
              <div className={styles.countdownNumber}>{timeLeft.minutes}</div>
              <div className={styles.countdownLabel}>分</div>
            </div>
            <div className={styles.countdownSeparator}>:</div>
            <div className={styles.countdownItem}>
              <div className={styles.countdownNumber}>{timeLeft.seconds}</div>
              <div className={styles.countdownLabel}>秒</div>
            </div>
          </div>
          <p className={styles.countdownText}>2025年10月17日 国际会议中心</p>
        </div>
      </section>
      
      {/* Quick Access */}
      <section className={styles.quickAccess}>
        <div className="container">
          <h2 className="section-title">快速入口</h2>
          <div className="grid grid-4">
            <Link href="/conference" className={styles.accessCard}>
              <div className={styles.accessIcon}>📋</div>
              <h3>会议介绍</h3>
              <p>了解会议详情、议程安排</p>
            </Link>
            <Link href="/papers" className={styles.accessCard}>
              <div className={styles.accessIcon}>📄</div>
              <h3>论文征稿</h3>
              <p>提交学术论文、查看要求</p>
            </Link>
            {!userLoggedIn ? (
              <Link href="/register" className={styles.accessCard}>
                <div className={styles.accessIcon}>✍️</div>
                <h3>注册报名</h3>
                <p>在线注册参会、选择类型</p>
              </Link>
            ) : (
              <Link href="/user/profile" className={styles.accessCard}>
                <div className={styles.accessIcon}>👤</div>
                <h3>个人中心</h3>
                <p>查看个人信息、管理报名</p>
              </Link>
            )}
            <Link href="/schedule" className={styles.accessCard}>
              <div className={styles.accessIcon}>📅</div>
              <h3>日程管理</h3>
              <p>查看个人日程、会议安排</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Conference Highlights */}
      <section className={styles.highlights}>
        <div className="container">
          <h2 className="section-title">会议亮点</h2>
          <div className="grid grid-3">
            <div className="card">
              <h3>顶级专家导师</h3>
              <p>邀请国内外知名医学专家，分享最新研究成果和临床经验</p>
            </div>
            <div className="card">
              <h3>前沿技术展示</h3>
              <p>展示最新医疗设备、诊断技术和治疗方案</p>
            </div>
            <div className="card">
              <h3>学术交流平台</h3>
              <p>提供充分的学术交流机会，促进合作与创新</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className={styles.news}>
        <div className="container">
          <h2 className="section-title">最新动态</h2>
          <div className="grid grid-2">
            <div className="card">
              <h3>会议注册开放</h3>
              <p className={styles.newsDate}>2025-07-15</p>
              <p>2025年医学学术会议注册通道正式开放，欢迎广大医学工作者踊跃报名参加。</p>
            </div>
            <div className="card">
              <h3>论文征稿启动</h3>
              <p className={styles.newsDate}>2025-07-10</p>
              <p>本次会议论文征稿活动正式启动，欢迎提交高质量的学术论文。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}