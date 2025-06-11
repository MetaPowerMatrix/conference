'use client';

import { useState, useEffect } from 'react';
import styles from './sponsors.module.css';

// 赞助商类型定义
interface Sponsor {
  id: number;
  name: string;
  logo: string;
  level: 'platinum' | 'gold' | 'silver' | 'bronze';
  website?: string;
  description?: string;
}

// 赞助套餐类型定义
interface SponsorshipPackage {
  id: number;
  level: string;
  price: string;
  benefits: string[];
  color: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [packages, setPackages] = useState<SponsorshipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    company: '',
    contact: '',
    phone: '',
    email: '',
    package: '',
    message: ''
  });

  useEffect(() => {
    // 模拟从后端获取赞助商数据
    const fetchSponsors = async () => {
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        setSponsors([
          {
            id: 1,
            name: '华为技术有限公司',
            logo: '/api/placeholder/200/100',
            level: 'platinum',
            website: 'https://www.huawei.com',
            description: '全球领先的ICT基础设施和智能终端提供商'
          },
          {
            id: 2,
            name: '腾讯科技',
            logo: '/api/placeholder/200/100',
            level: 'platinum',
            website: 'https://www.tencent.com'
          },
          {
            id: 3,
            name: '阿里巴巴集团',
            logo: '/api/placeholder/200/100',
            level: 'gold',
            website: 'https://www.alibaba.com'
          },
          {
            id: 4,
            name: '百度公司',
            logo: '/api/placeholder/200/100',
            level: 'gold'
          },
          {
            id: 5,
            name: '京东集团',
            logo: '/api/placeholder/200/100',
            level: 'silver'
          },
          {
            id: 6,
            name: '美团',
            logo: '/api/placeholder/200/100',
            level: 'silver'
          },
          {
            id: 7,
            name: '字节跳动',
            logo: '/api/placeholder/200/100',
            level: 'bronze'
          },
          {
            id: 8,
            name: '小米科技',
            logo: '/api/placeholder/200/100',
            level: 'bronze'
          }
        ]);

        setPackages([
          {
            id: 1,
            level: '白金赞助商',
            price: '¥100,000',
            color: '#E5E4E2',
            benefits: [
              '会议主页显著位置展示企业LOGO',
              '会议现场主舞台背景板LOGO展示',
              '会议资料袋内放置企业宣传资料',
              '会议晚宴冠名权',
              '主题演讲时段（30分钟）',
              '展位优先选择权（3个展位）',
              '会议直播间LOGO展示',
              '会议纪念品定制权'
            ]
          },
          {
            id: 2,
            level: '黄金赞助商',
            price: '¥60,000',
            color: '#FFD700',
            benefits: [
              '会议主页LOGO展示',
              '会议现场背景板LOGO展示',
              '会议资料袋内放置企业宣传资料',
              '专题演讲时段（20分钟）',
              '展位选择权（2个展位）',
              '会议手册广告页面',
              '会议签到处LOGO展示'
            ]
          },
          {
            id: 3,
            level: '白银赞助商',
            price: '¥30,000',
            color: '#C0C0C0',
            benefits: [
              '会议主页LOGO展示',
              '会议现场LOGO展示',
              '会议资料袋内放置企业宣传单页',
              '产品展示时段（10分钟）',
              '标准展位（1个）',
              '会议手册企业介绍'
            ]
          },
          {
            id: 4,
            level: '青铜赞助商',
            price: '¥15,000',
            color: '#CD7F32',
            benefits: [
              '会议主页LOGO展示',
              '会议现场LOGO展示',
              '会议资料袋内放置企业名片',
              '会议手册企业名称列表',
              '网络推广支持'
            ]
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchSponsors();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应该调用后端API提交赞助申请
    console.log('赞助申请提交:', contactForm);
    alert('赞助申请已提交，我们将尽快与您联系！');
    setShowContactForm(false);
    setContactForm({
      company: '',
      contact: '',
      phone: '',
      email: '',
      package: '',
      message: ''
    });
  };

  const getSponsorsByLevel = (level: string) => {
    return sponsors.filter(sponsor => sponsor.level === level);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className={styles.sponsorsPage}>
      {/* 英雄区 */}
      <section className={styles.hero}>
        <div className="container">
          <h1>赞助商专区</h1>
          <p>携手共进，共创医学学术交流新高度</p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.number}>{sponsors.length}</span>
              <span className={styles.label}>合作伙伴</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.number}>1000+</span>
              <span className={styles.label}>参会人员</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.number}>50+</span>
              <span className={styles.label}>媒体报道</span>
            </div>
          </div>
        </div>
      </section>

      {/* 赞助商展示区 */}
      <section className={styles.sponsorShowcase}>
        <div className="container">
          <h2 className="section-title">感谢我们的合作伙伴</h2>
          
          {/* 白金赞助商 */}
          {getSponsorsByLevel('platinum').length > 0 && (
            <div className={styles.sponsorLevel}>
              <h3 className={styles.levelTitle}>白金赞助商</h3>
              <div className={styles.sponsorGrid}>
                {getSponsorsByLevel('platinum').map(sponsor => (
                  <div key={sponsor.id} className={`${styles.sponsorCard} ${styles.platinum}`}>
                    <div className={styles.logoContainer}>
                      <img src={sponsor.logo} alt={sponsor.name} />
                    </div>
                    <h4>{sponsor.name}</h4>
                    {sponsor.description && (
                      <p className={styles.description}>{sponsor.description}</p>
                    )}
                    {sponsor.website && (
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                        访问官网
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 黄金赞助商 */}
          {getSponsorsByLevel('gold').length > 0 && (
            <div className={styles.sponsorLevel}>
              <h3 className={styles.levelTitle}>黄金赞助商</h3>
              <div className={styles.sponsorGrid}>
                {getSponsorsByLevel('gold').map(sponsor => (
                  <div key={sponsor.id} className={`${styles.sponsorCard} ${styles.gold}`}>
                    <div className={styles.logoContainer}>
                      <img src={sponsor.logo} alt={sponsor.name} />
                    </div>
                    <h4>{sponsor.name}</h4>
                    {sponsor.website && (
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                        访问官网
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 白银赞助商 */}
          {getSponsorsByLevel('silver').length > 0 && (
            <div className={styles.sponsorLevel}>
              <h3 className={styles.levelTitle}>白银赞助商</h3>
              <div className={styles.sponsorGrid}>
                {getSponsorsByLevel('silver').map(sponsor => (
                  <div key={sponsor.id} className={`${styles.sponsorCard} ${styles.silver}`}>
                    <div className={styles.logoContainer}>
                      <img src={sponsor.logo} alt={sponsor.name} />
                    </div>
                    <h4>{sponsor.name}</h4>
                    {sponsor.website && (
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                        访问官网
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 青铜赞助商 */}
          {getSponsorsByLevel('bronze').length > 0 && (
            <div className={styles.sponsorLevel}>
              <h3 className={styles.levelTitle}>青铜赞助商</h3>
              <div className={styles.sponsorGrid}>
                {getSponsorsByLevel('bronze').map(sponsor => (
                  <div key={sponsor.id} className={`${styles.sponsorCard} ${styles.bronze}`}>
                    <div className={styles.logoContainer}>
                      <img src={sponsor.logo} alt={sponsor.name} />
                    </div>
                    <h4>{sponsor.name}</h4>
                    {sponsor.website && (
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                        访问官网
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 赞助套餐 */}
      <section className={styles.packages}>
        <div className="container">
          <h2 className="section-title">赞助套餐</h2>
          <p className="section-subtitle">选择适合您的赞助方案，获得最大的品牌曝光和商业价值</p>
          
          <div className={styles.packagesGrid}>
            {packages.map(pkg => (
              <div 
                key={pkg.id} 
                className={`${styles.packageCard} ${selectedPackage === pkg.id ? styles.selected : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className={styles.packageHeader} style={{ borderTopColor: pkg.color }}>
                  <h3>{pkg.level}</h3>
                  <div className={styles.price}>{pkg.price}</div>
                </div>
                <div className={styles.packageBody}>
                  <ul className={styles.benefitsList}>
                    {pkg.benefits.map((benefit, index) => (
                      <li key={index}>
                        <span className={styles.checkIcon}>✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.packageFooter}>
                  <button 
                    className={styles.selectButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setContactForm(prev => ({ ...prev, package: pkg.level }));
                      setShowContactForm(true);
                    }}
                  >
                    选择此套餐
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 赞助权益说明 */}
      <section className={styles.benefits}>
        <div className="container">
          <h2 className="section-title">赞助权益</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎯</div>
              <h3>品牌曝光</h3>
              <p>会议官网、现场背景、宣传资料等多渠道品牌展示，提升企业知名度和影响力</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🤝</div>
              <h3>商务合作</h3>
              <p>与行业专家、学者、企业代表深度交流，拓展商务合作机会和业务网络</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>📈</div>
              <h3>市场推广</h3>
              <p>通过会议平台推广产品和服务，直接接触目标客户群体，提升市场占有率</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎤</div>
              <h3>演讲机会</h3>
              <p>获得主题演讲或产品展示时段，向专业观众展示企业实力和创新成果</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>📱</div>
              <h3>媒体报道</h3>
              <p>会议期间的媒体采访和报道机会，扩大企业在行业内的声音和影响力</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🎁</div>
              <h3>定制服务</h3>
              <p>根据企业需求提供个性化的赞助方案和定制化的品牌推广服务</p>
            </div>
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className={styles.contact}>
        <div className="container">
          <h2 className="section-title">成为我们的合作伙伴</h2>
          <p className="section-subtitle">如果您有意向成为我们的赞助商，请联系我们获取详细的赞助方案</p>
          
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <strong>联系人：</strong>张经理
            </div>
            <div className={styles.contactItem}>
              <strong>电话：</strong>010-12345678
            </div>
            <div className={styles.contactItem}>
              <strong>邮箱：</strong>sponsor@conference.com
            </div>
            <div className={styles.contactItem}>
              <strong>微信：</strong>conference2024
            </div>
          </div>

          <button 
            className={styles.contactButton}
            onClick={() => setShowContactForm(true)}
          >
            立即咨询赞助方案
          </button>
        </div>
      </section>

      {/* 联系表单模态框 */}
      {showContactForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>赞助咨询</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowContactForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label>公司名称 *</label>
                <input
                  type="text"
                  value={contactForm.company}
                  onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>联系人 *</label>
                <input
                  type="text"
                  value={contactForm.contact}
                  onChange={(e) => setContactForm(prev => ({ ...prev, contact: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>联系电话 *</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>邮箱地址 *</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>意向套餐</label>
                <select
                  value={contactForm.package}
                  onChange={(e) => setContactForm(prev => ({ ...prev, package: e.target.value }))}
                >
                  <option value="">请选择赞助套餐</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.level}>{pkg.level}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>留言</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  placeholder="请描述您的具体需求或问题..."
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowContactForm(false)} className={styles.cancelButton}>
                  取消
                </button>
                <button type="submit" className={styles.submitButton}>
                  提交申请
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}