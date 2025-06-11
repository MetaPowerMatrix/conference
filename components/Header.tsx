'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import { getUserInfo } from '@/services/api'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    // 获取用户信息
    const info = getUserInfo()
    if (info) {
      setUserInfo(info)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={`${styles.header} ${styles.headerPadding}`}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🏥</span>
            <span className={styles.logoText}></span>
          </Link>
          
          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.activeNavLink : ''}`}>
              首页
            </Link>
            <Link href="/conference" className={`${styles.navLink} ${pathname === '/conference' ? styles.activeNavLink : ''}`}>
              会议介绍
            </Link>
            <Link href="/register" className={`${styles.navLink} ${pathname === '/register' ? styles.activeNavLink : ''}`}>
              注册报名
            </Link>
            <Link href="/papers" className={`${styles.navLink} ${pathname === '/papers' ? styles.activeNavLink : ''}`}>
              论文征稿
            </Link>
            <Link href="/schedule" className={`${styles.navLink} ${pathname === '/schedule' ? styles.activeNavLink : ''}`}>
              日程管理
            </Link>
            <Link href="/interaction" className={`${styles.navLink} ${pathname === '/interaction' ? styles.activeNavLink : ''}`}>
              互动交流
            </Link>
            <Link href="/resources" className={`${styles.navLink} ${pathname === '/resources' ? styles.activeNavLink : ''}`}>
              资源中心
            </Link>
            <Link href="/sponsors" className={`${styles.navLink} ${pathname === '/sponsors' ? styles.activeNavLink : ''}`}>
              赞助商专区
            </Link>
            <Link href="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.activeNavLink : ''}`}>
              联系我们
            </Link>
          </nav>
          
          <div className={styles.rightSection}>
            {userInfo ? (
              <Link href="/profile" className={styles.userInfoDesktop}>
                {userInfo.firstName || userInfo.lastName}
              </Link>
            ) : (
              <Link href="/register" className={styles.loginButton}>
                注册
              </Link>
            )}
            <button 
              className={styles.menuToggle}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}