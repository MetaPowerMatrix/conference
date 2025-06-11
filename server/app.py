import os
import sqlite3
import json
import uuid
import datetime
import jwt
import bcrypt
from flask import Flask, request, jsonify, send_file, g
from flask_cors import CORS
from werkzeug.utils import secure_filename
from functools import wraps

# 初始化Flask应用
app = Flask(__name__)
CORS(app)

# 配置
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'doc', 'docx'}
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

# 确保上传文件夹存在
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# 数据库初始化
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('conference.db')
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# 创建数据库表
def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # 用户表
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            organization TEXT NOT NULL,
            position TEXT NOT NULL,
            country TEXT NOT NULL,
            city TEXT NOT NULL,
            specialization TEXT,
            dietaryRequirements TEXT,
            accommodationNeeded BOOLEAN DEFAULT 0,
            transportationNeeded BOOLEAN DEFAULT 0,
            emergencyContact TEXT,
            emergencyPhone TEXT,
            registrationType TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # 管理员表
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # 论文表
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS papers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            abstract TEXT,
            keywords TEXT,
            file_path TEXT NOT NULL,
            original_filename TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        ''')
        
        # 互动问题表
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        ''')
        
        # 回答表
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (question_id) REFERENCES questions (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        ''')
        
        # 页面内容表
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS page_contents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_id TEXT NOT NULL,
            content TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(page_id)
        )
        ''')
        
        db.commit()

# 初始化数据库
init_db()

# 辅助函数
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def hash_password(password):
    # 生成密码哈希
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(hashed_password, password):
    # 验证密码
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

def generate_token(user_id):
    # 生成JWT令牌
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

def decode_token(token):
    # 解码JWT令牌
    try:
        payload = jwt.decode(
            token,
            app.config.get('SECRET_KEY'),
            algorithms=['HS256']
        )
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Token expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 从请求头中获取令牌
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        # 解码令牌
        user_id = decode_token(token)
        if isinstance(user_id, str):
            return jsonify({'message': user_id}), 401
        
        # 获取用户信息
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        current_user = cursor.fetchone()
        
        if not current_user:
            return jsonify({'message': 'User not found!'}), 401
        
        # 将用户信息传递给被装饰的函数
        return f(dict(current_user), *args, **kwargs)
    
    return decorated

def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 从请求头中获取令牌
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
        
        if not token:
            return jsonify({'message': 'Admin token is missing!'}), 401
        
        # 解码令牌
        admin_id = decode_token(token)
        if isinstance(admin_id, str):
            return jsonify({'message': admin_id}), 401
        
        # 获取管理员信息
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM admins WHERE id = ?', (admin_id,))
        current_admin = cursor.fetchone()
        
        if not current_admin:
            return jsonify({'message': 'Admin not found!'}), 401
        
        # 将管理员信息传递给被装饰的函数
        return f(dict(current_admin), *args, **kwargs)
    
    return decorated

# 路由
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 验证必填字段
    required_fields = ['email', 'phone', 'firstName', 'lastName', 'organization', 'position', 'country', 'city', 'registrationType']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'缺少注册信息: {field}'}), 400
    
    # 检查邮箱是否已存在
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
    if cursor.fetchone():
        return jsonify({'message': 'Email已经注册过了!'}), 400
    
    # 检查电话是否已存在
    cursor.execute('SELECT id FROM users WHERE phone = ?', (data['phone'],))
    if cursor.fetchone():
        return jsonify({'message': '电话已经注册过了!'}), 400
    
    # 插入新用户
    cursor.execute(
        '''INSERT INTO users (
            email, phone, firstName, lastName, organization, position, country, city, 
            specialization, dietaryRequirements, accommodationNeeded, transportationNeeded, 
            emergencyContact, emergencyPhone, registrationType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (
            data['email'], data['phone'], data['firstName'], data['lastName'], 
            data['organization'], data['position'], data['country'], data['city'],
            data.get('specialization', ''), data.get('dietaryRequirements', ''),
            1 if data.get('accommodationNeeded') else 0, 1 if data.get('transportationNeeded') else 0,
            data.get('emergencyContact', ''), data.get('emergencyPhone', ''), data['registrationType']
        )
    )
    db.commit()
    
    # 获取新用户ID
    user_id = cursor.lastrowid
    
    # 生成令牌
    token = generate_token(user_id)
    
    return jsonify({
        'message': 'User registered successfully!',
        'token': token,
        'user': {
            'id': user_id,
            'email': data['email'],
            'firstName': data['firstName'],
            'lastName': data['lastName']
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    try:
        # 尝试获取JSON数据
        data = request.get_json(force=True)
        
        # 验证必填字段 - 至少需要提供email或phone中的一个
        if not data or (not data.get('email') and not data.get('phone')):
            return jsonify({'message': 'Missing login credentials! Please provide email or phone.'}), 400
        
        # 查询用户
        db = get_db()
        cursor = db.cursor()
        
        user = None
        if data.get('email'):
            cursor.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
            user = cursor.fetchone()
        
        if not user and data.get('phone'):
            cursor.execute('SELECT * FROM users WHERE phone = ?', (data['phone'],))
            user = cursor.fetchone()
        
        if not user:
            return jsonify({'message': 'User not found! Please check your email or phone number.'}), 401
        
        # 生成令牌
        token = generate_token(user['id'])
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'firstName': user['firstName'],
                'lastName': user['lastName'],
                'phone': user['phone']
            }
        })
    except Exception as e:
        # 记录错误并返回友好的错误消息
        print(f"Login error: {str(e)}")
        return jsonify({'message': f'Error processing login request: {str(e)}'}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        # 尝试获取JSON数据
        data = request.get_json(force=True)
        
        # 验证必填字段
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'message': 'Missing username or password!'}), 400
        
        # 查询管理员
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM admins WHERE username = ?', (data['username'],))
        admin = cursor.fetchone()
        
        if not admin:
            return jsonify({'message': 'Admin not found! Please check your username.'}), 401
        
        # 验证密码
        if not check_password(admin['password'], data['password']):
            return jsonify({'message': 'Invalid password!'}), 401
        
        # 生成令牌
        token = generate_token(admin['id'])
        
        return jsonify({
            'token': token,
            'user': {
                'id': admin['id'],
                'username': admin['username'],
                'email': admin['email'],
                'full_name': admin['full_name'],
                'is_admin': True
            }
        })
    except Exception as e:
        # 记录错误并返回友好的错误消息
        print(f"Admin login error: {str(e)}")
        return jsonify({'message': f'Error processing admin login request: {str(e)}'}), 500

@app.route('/api/papers/upload', methods=['POST'])
@token_required
def upload_paper(current_user):
    # 检查是否有文件
    if 'file' not in request.files:
        return jsonify({'message': 'No file part!'}), 400
    
    file = request.files['file']
    
    # 检查文件名
    if file.filename == '':
        return jsonify({'message': 'No selected file!'}), 400
    
    # 检查文件类型
    if not allowed_file(file.filename):
        return jsonify({'message': 'File type not allowed!'}), 400
    
    # 安全地保存文件
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(file_path)
    
    # 获取论文元数据
    title = request.form.get('title', 'Untitled Paper')
    abstract = request.form.get('abstract', '')
    keywords = request.form.get('keywords', '')
    
    # 保存到数据库
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO papers (user_id, title, abstract, keywords, file_path, original_filename) VALUES (?, ?, ?, ?, ?, ?)',
        (current_user['id'], title, abstract, keywords, file_path, filename)
    )
    db.commit()
    
    paper_id = cursor.lastrowid
    
    return jsonify({
        'message': 'Paper uploaded successfully!',
        'paper_id': paper_id,
        'title': title
    }), 201

@app.route('/api/papers/user', methods=['GET'])
@token_required
def get_user_papers(current_user):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'SELECT id, title, abstract, keywords, original_filename, uploaded_at FROM papers WHERE user_id = ? ORDER BY uploaded_at DESC',
        (current_user['id'],)
    )
    
    papers = []
    for row in cursor.fetchall():
        papers.append({
            'id': row['id'],
            'title': row['title'],
            'abstract': row['abstract'],
            'keywords': row['keywords'],
            'filename': row['original_filename'],
            'uploaded_at': row['uploaded_at']
        })
    
    return jsonify({
        'papers': papers
    }), 200

@app.route('/api/papers/download/<int:paper_id>', methods=['GET'])
@token_required
def download_paper(current_user, paper_id):
    db = get_db()
    cursor = db.cursor()
    
    # 查询论文
    cursor.execute('SELECT * FROM papers WHERE id = ?', (paper_id,))
    paper = cursor.fetchone()
    
    if not paper:
        return jsonify({'message': 'Paper not found!'}), 404
    
    # 检查权限（只允许论文所有者或管理员下载）
    if paper['user_id'] != current_user['id']:
        # 这里可以添加管理员检查
        return jsonify({'message': 'Unauthorized!'}), 403
    
    # 发送文件
    return send_file(
        paper['file_path'],
        as_attachment=True,
        download_name=paper['original_filename']
    )

@app.route('/api/papers/all', methods=['GET'])
@token_required
def get_all_papers(current_user):
    db = get_db()
    cursor = db.cursor()
    
    # 查询所有论文并关联用户表获取作者姓名
    cursor.execute(
        '''
        SELECT p.id, p.title, p.abstract, p.keywords, p.file_path, p.original_filename, p.uploaded_at,
               u.firstName, u.lastName
        FROM papers p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.uploaded_at DESC
        '''
    )
    
    papers = []
    for row in cursor.fetchall():
        # 获取文件大小
        file_size = 0
        if os.path.exists(row['file_path']):
            file_size = os.path.getsize(row['file_path'])
        
        # 获取文件类型
        file_type = ''
        if '.' in row['original_filename']:
            file_type = row['original_filename'].rsplit('.', 1)[1].lower()
        
        papers.append({
            'id': row['id'],
            'title': row['title'],
            'abstract': row['abstract'],
            'keywords': row['keywords'],
            'filename': row['original_filename'],
            'uploaded_at': row['uploaded_at'],
            'author': f"{row['firstName']} {row['lastName']}",
            'file_size': file_size,
            'file_type': file_type
        })
    
    return jsonify({
        'papers': papers
    }), 200

@app.route('/api/questions', methods=['POST'])
@token_required
def post_question(current_user):
    data = request.get_json()
    
    # 验证必填字段
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'message': 'Missing title or content!'}), 400
    
    # 保存问题
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO questions (user_id, title, content) VALUES (?, ?, ?)',
        (current_user['id'], data['title'], data['content'])
    )
    db.commit()
    
    question_id = cursor.lastrowid
    
    return jsonify({
        'message': 'Question posted successfully!',
        'question_id': question_id
    }), 201

@app.route('/api/questions', methods=['GET'])
def get_questions():
    # 分页参数
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    offset = (page - 1) * limit
    
    db = get_db()
    cursor = db.cursor()
    
    # 获取问题总数
    cursor.execute('SELECT COUNT(*) as count FROM questions')
    total = cursor.fetchone()['count']
    
    # 获取分页问题列表
    cursor.execute(
        '''
        SELECT q.id, q.title, q.content, q.created_at as post_date, u.email, u.firstName, u.lastName,
               (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answers_count
        FROM questions q
        JOIN users u ON q.user_id = u.id
        ORDER BY q.created_at DESC
        LIMIT ? OFFSET ?
        ''',
        (limit, offset)
    )
    
    questions = []
    for row in cursor.fetchall():
        questions.append({
            'id': row['id'],
            'title': row['title'],
            'content': row['content'],
            'post_date': row['post_date'],
            'username': f"{row['firstName']}{row['lastName']}",
            'user': {
                'email': row['email'],
                'name': f"{row['firstName']} {row['lastName']}"
            },
            'answers_count': row['answers_count']
        })
    
    return jsonify({
        'questions': questions,
        'total': total,
        'page': page,
        'limit': limit,
        'pages': (total + limit - 1) // limit
    }), 200

@app.route('/api/questions/<int:question_id>', methods=['GET'])
def get_question_details(question_id):
    db = get_db()
    cursor = db.cursor()
    
    # 获取问题详情
    cursor.execute(
        '''
        SELECT q.id, q.title, q.content, q.created_at as post_date, u.id as user_id, 
               u.firstName || ' ' || u.lastName as username, 
               u.firstName || ' ' || u.lastName as full_name
        FROM questions q
        JOIN users u ON q.user_id = u.id
        WHERE q.id = ?
        ''',
        (question_id,)
    )
    
    question = cursor.fetchone()
    if not question:
        return jsonify({'message': 'Question not found!'}), 404
    
    # 获取问题的回答
    cursor.execute(
        '''
        SELECT a.id, a.content, a.created_at as post_date, u.id as user_id, 
               u.firstName || ' ' || u.lastName as username, 
               u.firstName || ' ' || u.lastName as full_name
        FROM answers a
        JOIN users u ON a.user_id = u.id
        WHERE a.question_id = ?
        ORDER BY a.created_at ASC
        ''',
        (question_id,)
    )
    
    answers = []
    for row in cursor.fetchall():
        answers.append({
            'id': row['id'],
            'content': row['content'],
            'post_date': row['post_date'],
            'username': row['username'],
            'user': {
                'id': row['user_id'],
                'username': row['username'],
                'full_name': row['full_name']
            }
        })
    
    return jsonify({
        'question': {
            'id': question['id'],
            'title': question['title'],
            'content': question['content'],
            'post_date': question['post_date'],
            'username': question['username'],
            'user': {
                'id': question['user_id'],
                'username': question['username'],
                'full_name': question['full_name']
            }
        },
        'answers': answers
    }), 200

@app.route('/api/questions/<int:question_id>/answers', methods=['POST'])
@token_required
def post_answer(current_user, question_id):
    data = request.get_json()
    
    # 验证必填字段
    if not data:
        return jsonify({'message': 'Missing data!'}), 400
        
    # 检查data是否为字符串（前端直接发送了内容字符串）
    if isinstance(data, str):
        content = data
    else:
        # 如果是对象，则获取content字段
        content = data.get('content')
        
    if not content:
        return jsonify({'message': 'Missing content!'}), 400
    
    # 检查问题是否存在
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT id FROM questions WHERE id = ?', (question_id,))
    if not cursor.fetchone():
        return jsonify({'message': 'Question not found!'}), 404
    
    # 保存回答
    cursor.execute(
        'INSERT INTO answers (question_id, user_id, content) VALUES (?, ?, ?)',
        (question_id, current_user['id'], content)
    )
    db.commit()
    
    answer_id = cursor.lastrowid
    
    return jsonify({
        'message': 'Answer posted successfully!',
        'answer_id': answer_id
    }), 201

@app.route('/api/users/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'id': current_user['id'],
        'username': current_user['username'],
        'email': current_user['email'],
        'full_name': current_user['full_name'],
        'affiliation': current_user['affiliation'],
        'title': current_user['title'],
        'phone': current_user['phone']
    }), 200

# 内容管理API
@app.route('/api/content/<string:page_id>', methods=['GET'])
def get_page_content(page_id):
    db = get_db()
    cursor = db.cursor()
    
    # 获取页面内容
    cursor.execute('SELECT content FROM page_contents WHERE page_id = ?', (page_id,))
    result = cursor.fetchone()
    
    if result:
        # 解析JSON内容
        content = json.loads(result['content'])
        return jsonify(content), 200
    else:
        # 如果页面内容不存在，返回空字段
        return jsonify({
            'page_id': page_id,
            'fields': []
        }), 200

@app.route('/api/content/<string:page_id>', methods=['POST'])
@token_required
def save_page_content(current_user, page_id):
    data = request.get_json()
    
    # 验证数据
    if not data or 'fields' not in data:
        return jsonify({'message': 'Invalid content data!'}), 400
    
    # 将内容转换为JSON字符串
    content_json = json.dumps(data)
    
    db = get_db()
    cursor = db.cursor()
    
    # 检查页面内容是否已存在
    cursor.execute('SELECT id FROM page_contents WHERE page_id = ?', (page_id,))
    existing = cursor.fetchone()
    
    if existing:
        # 更新现有内容
        cursor.execute(
            'UPDATE page_contents SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE page_id = ?',
            (content_json, page_id)
        )
    else:
        # 插入新内容
        cursor.execute(
            'INSERT INTO page_contents (page_id, content) VALUES (?, ?)',
            (page_id, content_json)
        )
    
    db.commit()
    
    return jsonify({
        'message': 'Content saved successfully!',
        'page_id': page_id
    }), 200

# 文件读取和保存API
@app.route('/api/readFile', methods=['GET'])
@token_required
def read_file(current_user):
    path = request.args.get('path')
    if not path:
        return jsonify({'message': 'Missing file path!'}), 400
    
    try:
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        return content, 200, {'Content-Type': 'text/plain; charset=utf-8'}
    except Exception as e:
        return jsonify({'message': f'Error reading file: {str(e)}'}), 500

@app.route('/api/saveFile', methods=['POST'])
@token_required
def save_file(current_user):
    data = request.get_json()
    
    if not data or 'path' not in data or 'content' not in data:
        return jsonify({'message': 'Missing path or content!'}), 400
    
    path = data['path']
    content = data['content']
    
    # 确保目标目录存在
    directory = os.path.dirname(path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    try:
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
        return jsonify({'message': 'File saved successfully!'}), 200
    except Exception as e:
        return jsonify({'message': f'Error saving file: {str(e)}'}), 500

# 管理员API接口
@app.route('/api/admin/users', methods=['GET'])
@admin_token_required
def get_admin_users(current_admin):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # 获取所有用户列表
        cursor.execute(
            '''
            SELECT id, email, phone, firstName || ' ' || lastName as full_name, created_at as registration_date
            FROM users
            ORDER BY created_at DESC
            '''
        )
        
        users = []
        for row in cursor.fetchall():
            users.append({
                'id': row['id'],
                'email': row['email'],
                'phone': row['phone'],
                'full_name': row['full_name'],
                'registration_date': row['registration_date']
            })
        
        return jsonify({
            'users': users
        }), 200
    except Exception as e:
        print(f"Admin get users error: {str(e)}")
        return jsonify({'message': f'Error getting users: {str(e)}'}), 500

@app.route('/api/admin/papers', methods=['GET'])
@admin_token_required
def get_admin_papers(current_admin):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # 获取所有论文列表，包括用户信息
        cursor.execute(
            '''
            SELECT p.id, p.title, p.abstract, p.keywords, p.file_path, p.original_filename, p.uploaded_at,
                   p.user_id, u.firstName || ' ' || u.lastName as user_name
            FROM papers p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.uploaded_at DESC
            '''
        )
        
        papers = []
        for row in cursor.fetchall():
            papers.append({
                'id': row['id'],
                'title': row['title'],
                'abstract': row['abstract'],
                'keywords': row['keywords'],
                'file_path': row['file_path'],
                'original_filename': row['original_filename'],
                'uploaded_at': row['uploaded_at'],
                'user_id': row['user_id'],
                'user_name': row['user_name']
            })
        
        return jsonify({
            'papers': papers
        }), 200
    except Exception as e:
        print(f"Admin get papers error: {str(e)}")
        return jsonify({'message': f'Error getting papers: {str(e)}'}), 500

# 管理员删除用户API
@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@admin_token_required
def delete_user(current_admin, user_id):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # 首先检查用户是否存在
        cursor.execute('SELECT id FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': '用户不存在'}), 404
        
        # 开始事务
        db.execute('BEGIN TRANSACTION')
        
        try:
            # 删除用户的论文
            cursor.execute('SELECT id, file_path FROM papers WHERE user_id = ?', (user_id,))
            papers = cursor.fetchall()
            for paper in papers:
                # 删除物理文件
                paper_path = paper['file_path']
                if paper_path and os.path.exists(paper_path):
                    os.remove(paper_path)
                # 删除数据库记录
                cursor.execute('DELETE FROM papers WHERE id = ?', (paper['id'],))
            
            # 删除用户的回答
            cursor.execute('DELETE FROM answers WHERE user_id = ?', (user_id,))
            
            # 删除用户的问题
            cursor.execute('SELECT id FROM questions WHERE user_id = ?', (user_id,))
            questions = cursor.fetchall()
            for question in questions:
                # 删除问题的回答
                cursor.execute('DELETE FROM answers WHERE question_id = ?', (question['id'],))
                # 删除问题
                cursor.execute('DELETE FROM questions WHERE id = ?', (question['id'],))
            
            # 最后删除用户
            cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
            
            # 提交事务
            db.execute('COMMIT')
            
            return jsonify({'message': '用户删除成功'}), 200
        except Exception as e:
            # 回滚事务
            db.execute('ROLLBACK')
            raise e
    except Exception as e:
        print(f"Admin delete user error: {str(e)}")
        return jsonify({'message': f'删除用户失败: {str(e)}'}), 500

# 管理员删除论文API
@app.route('/api/admin/papers/<int:paper_id>', methods=['DELETE'])
@admin_token_required
def delete_paper(current_admin, paper_id):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # 首先检查论文是否存在
        cursor.execute('SELECT id, file_path FROM papers WHERE id = ?', (paper_id,))
        paper = cursor.fetchone()
        if not paper:
            return jsonify({'message': '论文不存在'}), 404
        
        # 删除物理文件
        paper_path = paper['file_path']
        if paper_path and os.path.exists(paper_path):
            os.remove(paper_path)
        
        # 删除数据库记录
        cursor.execute('DELETE FROM papers WHERE id = ?', (paper_id,))
        db.commit()
        
        return jsonify({'message': '论文删除成功'}), 200
    except Exception as e:
        print(f"Admin delete paper error: {str(e)}")
        return jsonify({'message': f'删除论文失败: {str(e)}'}), 500

# 管理员获取所有问题API
@app.route('/api/admin/questions', methods=['GET'])
@admin_token_required
def get_admin_questions(current_admin):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # 获取所有问题列表，包括用户信息和回答数量
        cursor.execute(
            '''
            SELECT q.id, q.title, q.content, q.created_at as post_date, q.user_id, 
                   u.firstName || '' || u.lastName as username,
                   (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
            FROM questions q
            JOIN users u ON q.user_id = u.id
            ORDER BY q.created_at DESC
            '''
        )
        
        questions = []
        for row in cursor.fetchall():
            questions.append({
                'id': row['id'],
                'title': row['title'],
                'content': row['content'],
                'post_date': row['post_date'],
                'user_id': row['user_id'],
                'username': row['username'],
                'answer_count': row['answer_count']
            })
        
        return jsonify({
            'questions': questions
        }), 200
    except Exception as e:
        print(f"Admin get questions error: {str(e)}")
        return jsonify({'message': f'Error getting questions: {str(e)}'}), 500

# 管理员删除问题API
@app.route('/api/admin/questions/<int:question_id>', methods=['DELETE'])
@admin_token_required
def delete_question(current_admin, question_id):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # 首先检查问题是否存在
        cursor.execute('SELECT id FROM questions WHERE id = ?', (question_id,))
        question = cursor.fetchone()
        if not question:
            return jsonify({'message': '问题不存在'}), 404
        
        # 开始事务
        db.execute('BEGIN TRANSACTION')
        
        try:
            # 删除问题的所有回答
            cursor.execute('DELETE FROM answers WHERE question_id = ?', (question_id,))
            
            # 删除问题
            cursor.execute('DELETE FROM questions WHERE id = ?', (question_id,))
            
            # 提交事务
            db.execute('COMMIT')
            
            return jsonify({'message': '问题删除成功'}), 200
        except Exception as e:
            # 回滚事务
            db.execute('ROLLBACK')
            raise e
    except Exception as e:
        print(f"Admin delete question error: {str(e)}")
        return jsonify({'message': f'删除问题失败: {str(e)}'}), 500

# 管理员删除回答API
@app.route('/api/admin/answers/<int:answer_id>', methods=['DELETE'])
@admin_token_required
def delete_answer(current_admin, answer_id):
    try:
        db = get_db()
        cursor = db.cursor()
        
        # 首先检查回答是否存在
        cursor.execute('SELECT id FROM answers WHERE id = ?', (answer_id,))
        answer = cursor.fetchone()
        if not answer:
            return jsonify({'message': '回答不存在'}), 404
        
        # 删除回答
        cursor.execute('DELETE FROM answers WHERE id = ?', (answer_id,))
        db.commit()
        
        return jsonify({'message': '回答删除成功'}), 200
    except Exception as e:
        print(f"Admin delete answer error: {str(e)}")
        return jsonify({'message': f'删除回答失败: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)