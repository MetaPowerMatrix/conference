'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../admin.module.css';
import { getAdminToken, getAdminInfo, request } from '@/services/api';

interface User {
  id: number;
  email: string;
  phone?: string;
  full_name: string;
  registration_date: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 检查管理员是否已登录
    const token = getAdminToken();
    const admin = getAdminInfo();

    if (!token || !admin) {
      // 未登录，重定向到登录页面
      router.replace('/admin/login');
      return;
    }

    // 加载用户列表
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 调用API获取用户列表
      const data = await request('/admin/users', {
        method: 'GET',
      });
      
      if (data && data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error('获取用户列表格式错误:', data);
        setUsers([]);
        setError('获取用户列表失败，数据格式错误');
      }
    } catch (err) {
      console.error('获取用户列表失败:', err);
      setError('获取用户列表失败，请稍后重试');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？此操作不可恢复，用户的所有论文和问答也将被删除。')) {
      return;
    }
    
    try {
      // 调用API删除用户
      await request(`/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      // 从列表中移除已删除的用户
      setUsers(users.filter(user => user.id !== userId));
      alert('用户删除成功');
    } catch (err) {
      console.error('删除用户失败:', err);
      alert('删除用户失败，请稍后重试');
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>用户管理</h1>
        <Link href="/admin" className={styles.backButton}>返回管理首页</Link>
      </header>

      <main className={styles.main}>
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>用户列表</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loading}></div>
              <p>加载中...</p>
            </div>
          ) : users.length === 0 ? (
            <div className={styles.emptyState}>
              <p>暂无用户数据</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>姓名</th>
                    <th>邮箱</th>
                    <th>电话</th>
                    <th>注册日期</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>{formatDate(user.registration_date)}</td>
                      <td>
                        <button className={styles.actionButton}>查看详情</button>
                        <button 
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}