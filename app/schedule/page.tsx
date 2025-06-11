'use client'

import { useState } from 'react'
import styles from './schedule.module.css'

type ScheduleItem = {
  id: string
  time: string
  title: string
  speaker?: string
  location: string
  type: 'keynote' | 'session' | 'break' | 'networking' | 'workshop'
  description?: string
  isBookmarked?: boolean
}

type DaySchedule = {
  date: string
  day: string
  items: ScheduleItem[]
}

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set())
  const [filterType, setFilterType] = useState<string>('all')

  const scheduleData: DaySchedule[] = [
    {
      date: '2024-06-15',
      day: '第一天',
      items: [
        {
          id: '1-1',
          time: '08:00-09:00',
          title: '注册签到',
          location: '会议中心大厅',
          type: 'networking',
          description: '参会者注册、领取会议资料包、网络交流'
        },
        {
          id: '1-2',
          time: '09:00-09:30',
          title: '开幕式',
          location: '主会场',
          type: 'keynote',
          description: '会议开幕致辞、嘉宾介绍'
        },
        {
          id: '1-3',
          time: '09:30-10:30',
          title: '主旨演讲：精准医学的未来发展',
          speaker: '张院士',
          location: '主会场',
          type: 'keynote',
          description: '探讨精准医学在临床应用中的最新进展和未来发展趋势'
        },
        {
          id: '1-4',
          time: '10:30-11:00',
          title: '茶歇时间',
          location: '展览区',
          type: 'break',
          description: '休息、交流、参观展览'
        },
        {
          id: '1-5',
          time: '11:00-12:30',
          title: '分会场A：基因治疗专题',
          speaker: '李教授',
          location: '会议室A',
          type: 'session',
          description: '基因编辑技术在疾病治疗中的应用'
        },
        {
          id: '1-6',
          time: '11:00-12:30',
          title: '分会场B：AI医疗影像',
          speaker: '王博士',
          location: '会议室B',
          type: 'session',
          description: '人工智能在医学影像诊断中的创新应用'
        },
        {
          id: '1-7',
          time: '12:30-14:00',
          title: '午餐时间',
          location: '餐厅',
          type: 'break',
          description: '午餐及自由交流时间'
        },
        {
          id: '1-8',
          time: '14:00-15:30',
          title: '工作坊：临床试验设计',
          speaker: '陈主任',
          location: '培训室',
          type: 'workshop',
          description: '临床试验方案设计的实践指导'
        },
        {
          id: '1-9',
          time: '15:30-16:00',
          title: '下午茶时间',
          location: '展览区',
          type: 'break',
          description: '休息、交流、参观展览'
        },
        {
          id: '1-10',
          time: '16:00-17:30',
          title: '青年学者论坛',
          location: '主会场',
          type: 'session',
          description: '青年研究者学术报告和交流'
        }
      ]
    },
    {
      date: '2024-06-16',
      day: '第二天',
      items: [
        {
          id: '2-1',
          time: '09:00-10:00',
          title: '主旨演讲：AI在药物发现中的应用',
          speaker: '刘教授',
          location: '主会场',
          type: 'keynote',
          description: '人工智能技术在新药研发中的革命性应用'
        },
        {
          id: '2-2',
          time: '10:00-10:30',
          title: '茶歇时间',
          location: '展览区',
          type: 'break',
          description: '休息、交流、参观展览'
        },
        {
          id: '2-3',
          time: '10:30-12:00',
          title: '分会场A：免疫治疗进展',
          speaker: '赵博士',
          location: '会议室A',
          type: 'session',
          description: '肿瘤免疫治疗的最新研究进展'
        },
        {
          id: '2-4',
          time: '10:30-12:00',
          title: '分会场B：数字健康创新',
          speaker: '孙教授',
          location: '会议室B',
          type: 'session',
          description: '数字化医疗服务模式的创新与实践'
        },
        {
          id: '2-5',
          time: '12:00-13:30',
          title: '午餐时间',
          location: '餐厅',
          type: 'break',
          description: '午餐及自由交流时间'
        },
        {
          id: '2-6',
          time: '13:30-15:00',
          title: '圆桌讨论：医疗监管政策',
          location: '主会场',
          type: 'session',
          description: '医疗器械和药物监管政策的发展趋势'
        },
        {
          id: '2-7',
          time: '15:00-15:30',
          title: '下午茶时间',
          location: '展览区',
          type: 'break',
          description: '休息、交流、参观展览'
        },
        {
          id: '2-8',
          time: '15:30-17:00',
          title: '企业展示专场',
          location: '展览厅',
          type: 'session',
          description: '医药企业最新产品和技术展示'
        },
        {
          id: '2-9',
          time: '19:00-21:00',
          title: '学术交流晚宴',
          location: '宴会厅',
          type: 'networking',
          description: '正式晚宴及颁奖典礼'
        }
      ]
    },
    {
      date: '2024-06-17',
      day: '第三天',
      items: [
        {
          id: '3-1',
          time: '09:00-10:30',
          title: '主旨演讲：未来医疗趋势展望',
          speaker: '周院士',
          location: '主会场',
          type: 'keynote',
          description: '医疗技术发展趋势和未来展望'
        },
        {
          id: '3-2',
          time: '10:30-11:00',
          title: '茶歇时间',
          location: '展览区',
          type: 'break',
          description: '休息、交流、参观展览'
        },
        {
          id: '3-3',
          time: '11:00-12:30',
          title: '最佳论文报告',
          location: '主会场',
          type: 'session',
          description: '优秀论文作者学术报告'
        },
        {
          id: '3-4',
          time: '12:30-14:00',
          title: '午餐时间',
          location: '餐厅',
          type: 'break',
          description: '午餐及自由交流时间'
        },
        {
          id: '3-5',
          time: '14:00-15:30',
          title: '闭幕式及颁奖典礼',
          location: '主会场',
          type: 'keynote',
          description: '会议总结、优秀论文颁奖、闭幕致辞'
        },
        {
          id: '3-6',
          time: '15:30-16:00',
          title: '合影留念',
          location: '主会场',
          type: 'networking',
          description: '全体参会者合影留念'
        }
      ]
    }
  ]

  const typeLabels = {
    all: '全部',
    keynote: '主旨演讲',
    session: '学术报告',
    workshop: '工作坊',
    break: '休息时间',
    networking: '交流活动'
  }

  const typeColors = {
    keynote: '#C63734',
    session: '#2E86AB',
    workshop: '#A23B72',
    break: '#F18F01',
    networking: '#C73E1D'
  }

  const toggleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const filteredItems = filterType === 'all' 
    ? scheduleData[selectedDay].items 
    : scheduleData[selectedDay].items.filter(item => item.type === filterType)

  return (
    <div className={styles.schedulePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="section-title">日程管理</h1>
          <p className="section-subtitle">
            查看详细会议日程，管理您的个人议程安排
          </p>
        </div>
      </section>

      {/* Schedule Navigation */}
      <section className={styles.scheduleNav}>
        <div className="container">
          <div className={styles.navTabs}>
            {scheduleData.map((day, index) => (
              <button
                key={index}
                className={`${styles.navTab} ${selectedDay === index ? styles.active : ''}`}
                onClick={() => setSelectedDay(index)}
              >
                <div className={styles.tabDate}>{day.date}</div>
                <div className={styles.tabDay}>{day.day}</div>
              </button>
            ))}
          </div>
          
          <div className={styles.filters}>
            <label>筛选类型：</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.filterSelect}
            >
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Schedule Content */}
      <section className={styles.scheduleContent}>
        <div className="container">
          <div className={styles.scheduleHeader}>
            <h2>{scheduleData[selectedDay].day} - {scheduleData[selectedDay].date}</h2>
            <div className={styles.legend}>
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className={styles.legendItem}>
                  <div 
                    className={styles.legendColor} 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{typeLabels[type as keyof typeof typeLabels]}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.scheduleList}>
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`${styles.scheduleItem} ${styles[item.type]}`}
              >
                <div className={styles.itemTime}>
                  {item.time}
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <button 
                      className={`${styles.bookmarkBtn} ${bookmarkedItems.has(item.id) ? styles.bookmarked : ''}`}
                      onClick={() => toggleBookmark(item.id)}
                      title={bookmarkedItems.has(item.id) ? '取消收藏' : '收藏'}
                    >
                      {bookmarkedItems.has(item.id) ? '★' : '☆'}
                    </button>
                  </div>
                  {item.speaker && (
                    <div className={styles.itemSpeaker}>
                      演讲者：{item.speaker}
                    </div>
                  )}
                  <div className={styles.itemLocation}>
                    📍 {item.location}
                  </div>
                  {item.description && (
                    <div className={styles.itemDescription}>
                      {item.description}
                    </div>
                  )}
                  <div className={styles.itemType}>
                    <span 
                      className={styles.typeTag}
                      style={{ backgroundColor: typeColors[item.type] }}
                    >
                      {typeLabels[item.type]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Schedule */}
      {bookmarkedItems.size > 0 && (
        <section className={styles.mySchedule}>
          <div className="container">
            <h2 className="section-title">我的日程</h2>
            <div className={styles.bookmarkedList}>
              {scheduleData.flatMap(day => 
                day.items.filter(item => bookmarkedItems.has(item.id))
              ).map((item) => (
                <div key={item.id} className={styles.bookmarkedItem}>
                  <div className={styles.bookmarkedTime}>{item.time}</div>
                  <div className={styles.bookmarkedTitle}>{item.title}</div>
                  <div className={styles.bookmarkedLocation}>{item.location}</div>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => toggleBookmark(item.id)}
                    title="移除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}