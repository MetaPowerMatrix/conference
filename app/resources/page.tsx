'use client'

import { useState, useEffect } from 'react'
import styles from './resources.module.css'
import { papersAPI } from '@/services/api'

type Resource = {
  id: string
  title: string
  description: string
  type: 'pdf' | 'video' | 'presentation' | 'document'
  category: string
  author: string
  date: string
  downloadUrl: string
  viewUrl?: string
  size?: string
  downloads: number
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = {
    all: '全部分类',
    'precision-medicine': '精准医学',
    'ai-healthcare': 'AI医疗',
    'drug-development': '新药研发',
    'digital-health': '数字健康',
    'clinical-research': '临床研究',
    'medical-devices': '医疗器械'
  }

  const types = {
    all: '全部类型',
    pdf: 'PDF文档',
    video: '视频资料',
    presentation: '演示文稿',
    document: '文档资料'
  }

  // 从后端获取论文列表
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true)
      try {
        const papers = await papersAPI.getAllPapers()
        // 修复：使用data.papers而不是直接使用data
        if (papers && papers.papers && Array.isArray(papers.papers)) {
          // 将后端返回的论文数据转换为资源格式
          const paperResources: Resource[] = papers.papers.map((paper: any) => ({
            id: paper.id.toString(),
            title: paper.title,
            description: paper.abstract || '无摘要',
            type: paper.file_type || 'pdf', // 假设所有论文都是PDF格式
            category: paper.category || 'clinical-research',
            author: paper.author || '未知作者',
            date: paper.created_at || new Date().toISOString().split('T')[0],
            downloadUrl: `/api/papers/download/${paper.id}`,
            size: paper.file_size ? 
              (paper.file_size >= 1024 * 1024 
                ? `${(paper.file_size / (1024 * 1024)).toFixed(2)}M`
                : paper.file_size >= 1024
                  ? `${(paper.file_size / 1024).toFixed(2)}K`
                  : `${paper.file_size}B`) 
              : '未知大小',
            downloads: paper.download_count || 0
          }))
          console.log(paperResources)
          setResources(paperResources)
        }
      } catch (error) {
        console.error('获取论文列表失败:', error)
        // 如果API调用失败，设置空数组
        setResources([])
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const handleDownload = (resource: Resource) => {
    // 调用后端API下载论文
    const paperId = parseInt(resource.id)
    if (!isNaN(paperId)) {
      papersAPI.downloadPaper(paperId)
      
      // 更新下载计数（仅UI显示，实际计数由后端处理）
      setResources(prev => prev.map(r => 
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      ))
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesType = selectedType === 'all' || resource.type === selectedType
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesType && matchesSearch
  })

  console.log(filteredResources)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'video': return '🎥'
      case 'presentation': return '📊'
      case 'document': return '📝'
      default: return '📄'
    }
  }

  return (
    <div className={styles.resourcesPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="section-title">资源中心</h1>
          <p className="section-subtitle">
            获取最新的医学研究资料、学术论文、技术文档和专业视频
          </p>
        </div>
      </section>

      {/* All Resources */}
      <section className={styles.allResourcesSection}>
        <div className="container">
          <h2 className="section-title">论文资源</h2>
          
          {/* Search and Filters */}
          <div className={styles.filtersSection}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="搜索资源..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label>分类:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                  {Object.entries(categories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label>类型:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={styles.filterSelect}
                >
                  {Object.entries(types).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resources List */}
          <div className={styles.resourcesList}>
            {loading ? (
              <div className={styles.loading}>加载中...</div>
            ) : filteredResources.length === 0 ? (
              <div className={styles.empty}>未找到相关资源</div>
            ) : (
              <div className={styles.resourcesGrid}>
                {filteredResources.map((resource) => (
                  <div key={resource.id} className={styles.resourceCard}>
                    <div className={styles.resourceHeader}>
                      <div className={styles.typeIcon}>{getTypeIcon(resource.type)}</div>
                      <div className={styles.resourceMeta}>
                        <span className={styles.category}>
                          {categories[resource.category as keyof typeof categories] || '未分类'}
                        </span>
                        <span className={styles.type}>
                          {types[resource.type as keyof typeof types] || '未知类型'}
                        </span>
                      </div>
                    </div>
                    <h3 className={styles.resourceTitle}>{resource.title}</h3>
                    <p className={styles.resourceDescription}>{resource.description}</p>
                    <div className={styles.resourceInfo}>
                      <span className={styles.author}>作者: {resource.author}</span>
                      <span className={styles.date}>{resource.date}</span>
                      <span className={styles.size}>{resource.size}</span>
                      <span className={styles.downloads}>下载: {resource.downloads}</span>
                    </div>
                    <div className={styles.resourceActions}>
                      {resource.viewUrl && (
                        <button className="btn btn-outline">
                          预览
                        </button>
                      )}
                      <button 
                        className="btn"
                        onClick={() => handleDownload(resource)}
                      >
                        下载
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}