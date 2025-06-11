'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';
import { getAdminToken, getAdminInfo, clearAdminToken } from '@/services/api';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 检查管理员是否已登录，使用正确的键名
    const token = getAdminToken();
    const user = getAdminInfo();

    if (!token || !user) {
      // 未登录，重定向到登录页面
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    // 使用API提供的方法清除管理员认证信息
    clearAdminToken();
    // 重定向到登录页面
    router.replace('/admin/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 防止在重定向前显示内容
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>会议管理系统</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>退出登录</button>
      </header>

      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>内容管理</h2>
        <div className={styles.cardsGrid}>
          <Link href="/admin/content/home" className={styles.card}>
            <h3>首页内容</h3>
            <p>编辑首页的标题、倒计时、快速入口等内容</p>
          </Link>
          <Link href="/admin/content/conference" className={styles.card}>
            <h3>会议介绍</h3>
            <p>编辑会议概况、主题、议程安排等内容</p>
          </Link>
          <Link href="/admin/content/register" className={styles.card}>
            <h3>注册页面</h3>
            <p>编辑注册页面的标题、参会类型等内容</p>
          </Link>
          <Link href="/admin/content/papers" className={styles.card}>
            <h3>论文征集</h3>
            <p>编辑论文征集页面的内容</p>
          </Link>
          <Link href="/admin/content/interaction" className={styles.card}>
            <h3>互动问答</h3>
            <p>编辑互动问答页面的内容</p>
          </Link>
          <Link href="/admin/content/contact" className={styles.card}>
            <h3>联系我们</h3>
            <p>编辑联系我们页面的内容</p>
          </Link>
          <Link href="/admin/content/sponsors" className={styles.card}>
            <h3>赞助商</h3>
            <p>编辑赞助商页面的内容</p>
          </Link>
          <Link href="/admin/content/schedule" className={styles.card}>
            <h3>会议日程</h3>
            <p>编辑会议日程页面的内容</p>
          </Link>
          <Link href="/admin/content/resources" className={styles.card}>
            <h3>资源下载</h3>
            <p>编辑资源下载页面的内容</p>
          </Link>
        </div>

        <h2 className={styles.sectionTitle}>用户管理</h2>
        <div className={styles.cardsGrid}>
          <Link href="/admin/users" className={styles.card}>
            <h3>用户列表</h3>
            <p>查看和管理注册用户</p>
          </Link>
          <Link href="/admin/papers" className={styles.card}>
            <h3>论文管理</h3>
            <p>查看和管理用户提交的论文</p>
          </Link>
          <Link href="/admin/questions" className={styles.card}>
            <h3>互动问答</h3>
            <p>管理用户提问和回答</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/admin/questions/all" className={styles.footerLink}>
            查看全部问答数据
          </Link>
        </div>
      </footer>
    </div>
  );
}