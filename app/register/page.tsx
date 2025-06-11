'use client'

import { useState } from 'react'
import styles from './register.module.css'
import { authAPI, setUserInfo, setUserToken } from '@/services/api'
import { useRouter } from 'next/navigation'

type RegistrationType = 'academic' | 'student' | 'industry' | 'media'

export default function Register() {
  const [formData, setFormData] = useState({
    registrationType: '' as RegistrationType | '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    country: '',
    city: '',
    specialization: '',
    dietaryRequirements: '',
    accommodationNeeded: false,
    transportationNeeded: false,
    emergencyContact: '',
    emergencyPhone: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const registrationTypes = {
    academic: { name: '学术参会者', price: 1200, description: '高校、科研院所研究人员' },
    student: { name: '学生优惠', price: 600, description: '在校学生（需提供学生证明）' },
    industry: { name: '企业参会者', price: 1800, description: '医药企业、医疗器械公司等' },
    media: { name: '媒体记者', price: 0, description: '经认证的媒体工作者' }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')
    
    try {
      // 调用实际的后端接口api/register,把formData转换成json数据发送到后端
      // 后端接口也需要修改接收全部注册信息，数据表结构也需要修改
      const response = await authAPI.register(formData)
      
      console.log('注册成功:', response)
      setSubmitStatus('success')
      
      // 注册成功后延迟1秒跳转到首页
      setTimeout(() => {
        router.push('/')
      }, 1000)
      
      // 重置表单
      setFormData({
        registrationType: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        position: '',
        country: '',
        city: '',
        specialization: '',
        dietaryRequirements: '',
        accommodationNeeded: false,
        transportationNeeded: false,
        emergencyContact: '',
        emergencyPhone: ''
      })
    } catch (error) {
      console.error('注册失败:', error)
      setSubmitStatus('error')
      // 捕获并显示后端返回的错误消息
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('注册失败，请检查信息后重试。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedType = formData.registrationType ? registrationTypes[formData.registrationType] : null

  return (
    <div className={styles.registerPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="section-title">注册报名</h1>
          <p className="section-subtitle">
            立即注册参加2024年医学学术会议，与全球医学专家共同探讨前沿技术
          </p>
        </div>
      </section>

      {/* Registration Types */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">选择参会类型</h2>
          <div className={styles.registrationTypes}>
            {Object.entries(registrationTypes).map(([key, type]) => (
              <div 
                key={key}
                className={`${styles.typeCard} ${formData.registrationType === key ? styles.selected : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, registrationType: key as RegistrationType }))}
              >
                <h3>{type.name}</h3>
                <div className={styles.price}>
                  {type.price === 0 ? '免费' : `¥${type.price}`}
                </div>
                <p>{type.description}</p>
                <div className={styles.features}>
                  <div className={styles.feature}>✓ 全程会议参与</div>
                  <div className={styles.feature}>✓ 会议资料包</div>
                  <div className={styles.feature}>✓ 茶歇及午餐</div>
                  {key === 'academic' && <div className={styles.feature}>✓ 学术交流晚宴</div>}
                  {key === 'industry' && <div className={styles.feature}>✓ 企业展示机会</div>}
                  {key === 'student' && <div className={styles.feature}>✓ 青年学者论坛</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      {formData.registrationType && (
        <section className={styles.formSection}>
          <div className="container">
            <div className={styles.formContainer}>
              <div className={styles.formHeader}>
                <h2>参会信息填写</h2>
                <div className={styles.selectedType}>
                  已选择：{selectedType?.name} - {selectedType?.price === 0 ? '免费' : `¥${selectedType?.price}`}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className={styles.registrationForm}>
                <div className={styles.formSection}>
                  <h3>基本信息</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">姓 *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入姓氏"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName">名 *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入名字"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">邮箱 *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入邮箱地址"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">电话 *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入联系电话"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3>单位信息</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="organization">单位名称 *</label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入单位名称"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="position">职位 *</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入职位"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="country">国家/地区 *</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入国家/地区"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="city">城市 *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入城市"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3>其他信息</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="specialization">专业领域</label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="请输入专业领域"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="dietaryRequirements">饮食要求</label>
                      <input
                        type="text"
                        id="dietaryRequirements"
                        name="dietaryRequirements"
                        value={formData.dietaryRequirements}
                        onChange={handleInputChange}
                        placeholder="请输入特殊饮食要求"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="emergencyContact">紧急联系人</label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        placeholder="请输入紧急联系人姓名"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="emergencyPhone">紧急联系电话</label>
                      <input
                        type="tel"
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        placeholder="请输入紧急联系电话"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="accommodationNeeded"
                          checked={formData.accommodationNeeded}
                          onChange={handleInputChange}
                        />
                        需要住宿安排
                      </label>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="transportationNeeded"
                          checked={formData.transportationNeeded}
                          onChange={handleInputChange}
                        />
                        需要交通安排
                      </label>
                    </div>
                  </div>                  
                </div>

                <div className={styles.submitSection}>
                  {submitStatus === 'success' && (
                    <div className={styles.successMessage}>
                      ✅ 注册成功！。
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className={styles.errorMessage}>
                      ❌ {errorMessage || '注册失败，请检查信息后重试。'}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '提交中...' : `确认注册 (${selectedType?.price === 0 ? '免费' : `¥${selectedType?.price}`})`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}