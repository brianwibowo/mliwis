export default function Loading() {
  return (
    <div className="loading-page">
      <div className="loading-header">
        <div className="loading-header-left">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
        </div>
        <div className="skeleton loading-btn" />
      </div>
      <div className="skeleton skeleton-stat mb-6" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="skeleton" style={{ height: 40, flex: 1 }} />
        <div className="skeleton" style={{ height: 40, width: 150 }} />
      </div>
      <div className="skeleton-card">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton-table-row" style={{ gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 60px 40px 80px' }}>
            <div className="skeleton skeleton-table-cell" />
            <div className="skeleton skeleton-table-cell" />
            <div className="skeleton skeleton-table-cell" />
            <div className="skeleton skeleton-table-cell" />
            <div className="skeleton skeleton-table-cell" />
            <div className="skeleton skeleton-table-cell" />
            <div className="skeleton skeleton-table-cell" />
            <div className="skeleton skeleton-table-cell" />
          </div>
        ))}
      </div>
    </div>
  )
}
