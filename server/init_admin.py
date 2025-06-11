import sqlite3
import bcrypt
import os

# 确保数据库文件存在
def init_admin():
    # 检查数据库是否存在
    if not os.path.exists('conference.db'):
        print("数据库文件不存在，请先运行应用程序初始化数据库。")
        return False
    
    # 连接数据库
    conn = sqlite3.connect('conference.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # 检查是否已存在管理员用户
    cursor.execute("SELECT id FROM admins WHERE username = 'admin'")
    admin = cursor.fetchone()
    
    if admin:
        print("管理员用户已存在。")
        conn.close()
        return True
    
    # 创建管理员用户
    username = 'admin'
    password = 'admin123'  # 默认密码，建议首次登录后修改
    email = 'admin@medicalconference.com'
    full_name = '系统管理员'
    
    # 哈希密码
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        # 插入管理员用户
        cursor.execute(
            'INSERT INTO admins (username, password, email, full_name) VALUES (?, ?, ?, ?)',
            (username, hashed_password, email, full_name)
        )
        conn.commit()
        print(f"管理员用户创建成功！")
        print(f"用户名: {username}")
        print(f"密码: {password}")
        print("请登录后立即修改默认密码。")
        return True
    except Exception as e:
        conn.rollback()
        print(f"创建管理员用户失败: {str(e)}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    init_admin()