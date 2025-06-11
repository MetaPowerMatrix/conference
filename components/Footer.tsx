import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>医学学术会议</h3>
            <p className={styles.footerDesc}>
              专业的医学学术交流平台，致力于推动医学科技发展，促进学术合作与创新。
            </p>
            <div className={styles.contact}>
              <p>📧 contact@medconf.com</p>
              <p>📞 +86 0991-1234567</p>
              <p>📍 新疆医科大学</p>
            </div>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>快速链接</h4>
            <ul className={styles.linkList}>
              <li><Link href="/conference">会议介绍</Link></li>
              <li><Link href="/papers">论文征稿</Link></li>
              <li><Link href="/register">注册报名</Link></li>
              <li><Link href="/schedule">日程管理</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>服务支持</h4>
            <ul className={styles.linkList}>
              <li><Link href="/interaction">互动交流</Link></li>
              <li><Link href="/resources">资源中心</Link></li>
              <li><Link href="/sponsors">赞助商区</Link></li>
              <li><Link href="/help">帮助中心</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>关注我们</h4>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>微信</a>
              <a href="#" className={styles.socialLink}>微博</a>
              <a href="#" className={styles.socialLink}>邮箱</a>
            </div>
            <div className={styles.qrCode}>
              <div className={styles.qrPlaceholder}>
                <span>微信二维码</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>&copy; 2024 医学学术会议. 保留所有权利.</p>
          </div>
          <div className={styles.legal}>
            <Link href="/privacy">隐私政策</Link>
            <Link href="/terms">使用条款</Link>
            <Link href="/sitemap">网站地图</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}