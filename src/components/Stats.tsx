export default function Stats() {
  const stats = [
    { value: '15+', label: '年系统经验', desc: '从核心交易到物联网' },
    { value: '20万', label: 'TPS 实战', desc: '高并发架构落地' },
    { value: '多行业', label: '业务语境', desc: '金融 · 政务 · 出行' },
    { value: '求职中', label: '全职机会', desc: '全栈 / 系统架构' },
  ]

  return (
    <section className="section" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div className="container">
        <div className="cards-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card">
              <div className="card-num">{stat.value}</div>
              <h3>{stat.label}</h3>
              <p>{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
