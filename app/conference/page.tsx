import styles from './conference.module.css'

export default function Conference() {
  return (
    <div className={styles.conferencePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className="section-title">会议介绍</h1>
          <p className="section-subtitle">
            2024年医学学术会议 - 汇聚全球医学精英，共话医学未来
          </p>
        </div>
      </section>

      {/* Conference Overview */}
      <section className="section">
        <div className="container">
          <div className={styles.overview}>
            <div className={styles.overviewContent}>
              <h2 className={styles.sectionTitle}>会议概况</h2>
              <p className={styles.description}>
                本次医学学术会议是医学界的重要盛会，旨在为全球医学专家、研究人员、临床医生和医学生提供一个高水平的学术交流平台。
                会议将围绕精准医学、人工智能在医疗中的应用、新药研发、临床试验等前沿话题展开深入讨论。
              </p>
              <div className={styles.highlights}>
                <div className={styles.highlight}>
                  <h3>🎯 主办单位介绍</h3>
                  <p>中华医学会、国际医学研究协会</p>
                </div>
                <div className={styles.highlight}>
                  <h3>🏛️ 学术委员会名单</h3>
                  <p>由国内外知名医学专家组成的权威学术委员会</p>
                </div>
              </div>
            </div>
            <div className={styles.overviewImage}>
              <div className={styles.imagePlaceholder}>
                <span>会议现场图片</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conference Topics */}
      <section className={styles.topicsSection}>
        <div className="container">
          <h2 className="section-title">会议主题</h2>
          <div className="grid grid-2">
            <div className="card">
              <h3>精准医学与个性化治疗</h3>
              <p>探讨基因组学、蛋白质组学在精准医学中的应用，推动个性化治疗方案的发展。</p>
            </div>
            <div className="card">
              <h3>人工智能与医疗创新</h3>
              <p>分享AI在医学影像、药物发现、临床决策支持等领域的最新进展和应用案例。</p>
            </div>
            <div className="card">
              <h3>新药研发与临床试验</h3>
              <p>讨论新药研发流程优化、临床试验设计创新以及监管政策的最新发展。</p>
            </div>
            <div className="card">
              <h3>数字健康与远程医疗</h3>
              <p>探索数字化医疗服务模式、远程诊疗技术以及健康数据管理的创新应用。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Overview */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">议程安排</h2>
          <div className={styles.schedule}>
            <div className={styles.scheduleDay}>
              <h3>第一天 (6月15日)</h3>
              <div className={styles.scheduleItems}>
                <div className={styles.scheduleItem}>
                  <span className={styles.time}>09:00-10:30</span>
                  <span className={styles.event}>开幕式及主旨演讲</span>
                </div>
                <div className={styles.scheduleItem}>
                  <span className={styles.time}>11:00-12:30</span>
                  <span className={styles.event}>精准医学专题论坛</span>
                </div>
                <div className={styles.scheduleItem}>
                  <span className={styles.time}>14:00-17:30</span>
                  <span className={styles.event}>分会场学术报告</span>
                </div>
              </div>
            </div>
            
            <div className={styles.scheduleDay}>
              <h3>第二天 (6月16日)</h3>
              <div className={styles.scheduleItems}>
                <div className={styles.scheduleItem}>
                  <span className={styles.time}>09:00-12:00</span>
                  <span className={styles.event}>AI医疗创新论坛</span>
                </div>
                <div className={styles.scheduleItem}>
                  <span className={styles.time}>14:00-17:00</span>
                  <span className={styles.event}>新药研发研讨会</span>
                </div>
                <div className={styles.scheduleItem}>
                  <span className={styles.time}>19:00-21:00</span>
                  <span className={styles.event}>学术交流晚宴</span>
                </div>
              </div>
            </div>
            
            <div className={styles.scheduleDay}>
              <h3>第三天 (6月17日)</h3>
              <div className={styles.scheduleItems}>
                <div className={styles.scheduleItem}>
                  <span className={styles.time}>09:00-11:30</span>
                  <span className={styles.event}>青年学者论坛</span>
                </div>
                <div className={styles.scheduleItem}>
                  <span className={styles.time}>14:00-16:00</span>
                  <span className={styles.event}>闭幕式及颁奖典礼</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className={styles.speakersSection}>
        <div className="container">
          <h2 className="section-title">特邀嘉宾</h2>
          <div className="grid grid-3">
            <div className="card">
              <div className={styles.speakerAvatar}>
                <span>👨‍⚕️</span>
              </div>
              <h3>张教授</h3>
              <p className={styles.speakerTitle}>中科院院士</p>
              <p>精准医学领域权威专家，在基因治疗方面有重要贡献。</p>
            </div>
            <div className="card">
              <div className={styles.speakerAvatar}>
                <span>👩‍⚕️</span>
              </div>
              <h3>李主任</h3>
              <p className={styles.speakerTitle}>国际医学研究院院长</p>
              <p>AI医疗应用专家，推动人工智能在临床诊断中的应用。</p>
            </div>
            <div className="card">
              <div className={styles.speakerAvatar}>
                <span>👨‍🔬</span>
              </div>
              <h3>王博士</h3>
              <p className={styles.speakerTitle}>新药研发专家</p>
              <p>在新药研发和临床试验设计方面具有丰富经验。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}