'use client'

import { useState } from 'react'
import styles from './contact.module.css'

type ContactForm = {
  name: string
  email: string
  phone: string
  organization: string
  subject: string
  message: string
  contactType: string
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: '',
    contactType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)

  const contactTypes = {
    general: '一般咨询',
    registration: '注册相关',
    papers: '论文投稿',
    sponsorship: '赞助合作',
    media: '媒体合作',
    technical: '技术支持'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // 这里应该调用后端API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          subject: '',
          message: '',
          contactType: 'general'
        })
      // } else {
      //   setSubmitStatus('error')
      // }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="section-title">联系我们</h1>
          <p className="section-subtitle">
            有任何问题或建议，请随时与我们联系，我们将竭诚为您服务
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className={styles.contactInfo}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📍</div>
              <h3>会议地址</h3>
              <p>新疆医科大学<br />会议中心A座15层</p>
              <div className={styles.contactDetail}>
                <strong>会议厅:</strong> 国际会议中心A厅
              </div>
            </div>
            
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📞</div>
              <h3>联系电话</h3>
              <p>
                <strong>会务咨询:</strong> +86 0991-8888-8888<br />
                <strong>技术支持:</strong> +86 0991-8888-8889<br />
                <strong>媒体合作:</strong> +86 0991-8888-8890
              </p>
            </div>
            
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>✉️</div>
              <h3>电子邮箱</h3>
              <p>
                <strong>一般咨询:</strong> info@medconf2024.com<br />
                <strong>论文投稿:</strong> papers@medconf2024.com<br />
                <strong>赞助合作:</strong> sponsor@medconf2024.com
              </p>
            </div>
            
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>🕒</div>
              <h3>工作时间</h3>
              <p>
                <strong>周一至周五:</strong> 9:00 - 18:00<br />
                <strong>周六:</strong> 9:00 - 12:00<br />
                <strong>周日:</strong> 休息
              </p>
              <div className={styles.contactDetail}>
                <strong>会议期间:</strong> 24小时服务
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map and QR Codes */}
      <section className={styles.additionalInfo}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div className={styles.mapSection}>
              <h3>会议地点</h3>
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapIcon}>🗺️</div>
                <p>地图加载中...</p>
                <small>新疆医科大学雪莲山校区</small>
              </div>
              <div className={styles.mapInfo}>
                <h4>交通指南</h4>
                <ul>
                  <li><strong>地铁:</strong> XXXXXXX口</li>
                  <li><strong>公交:</strong> 1路、4路、37路 </li>
                  <li><strong>停车:</strong> 会议中心地下停车场（收费）</li>
                  <li><strong>机场:</strong> 地窝铺国际机场约45分钟车程</li>
                </ul>
              </div>
            </div>
            
            <div className={styles.qrSection}>
              <h3>关注我们</h3>
              <div className={styles.qrCodes}>
                <div className={styles.qrCode}>
                  <div className={styles.qrPlaceholder}>
                    <div className={styles.qrIcon}>📱</div>
                    <p>微信公众号</p>
                  </div>
                  <span>扫码关注获取最新资讯</span>
                </div>
                
                <div className={styles.qrCode}>
                  <div className={styles.qrPlaceholder}>
                    <div className={styles.qrIcon}>📱</div>
                    <p>会议小程序</p>
                  </div>
                  <span>扫码进入会议小程序</span>
                </div>
              </div>
              
              <div className={styles.socialLinks}>
                <h4>社交媒体</h4>
                <div className={styles.socialIcons}>
                  <a href="#" className={styles.socialIcon}>🐦 微博</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}