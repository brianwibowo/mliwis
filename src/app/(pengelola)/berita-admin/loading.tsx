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

      {/* Stat Card Skeleton */}
      <div className="skeleton skeleton-stat mb-6" style={{ maxWidth: 350 }} />

      {/* Filter Bar Placeholder */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="skeleton" style={{ height: 40, flex: 1, maxWidth: 300 }} />
        <div className="skeleton" style={{ height: 40, width: 150 }} />
      </div>

      {/* Table Card Skeleton */}
      <div className="skeleton-card">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="skeleton-table-row" style={{ gridTemplateColumns: '50px 60px 2fr 1fr 1fr 1fr 1fr 100px' }}>
            <div className="skeleton skeleton-table-cell" />
            <div className="skeleton skeleton-table-cell" style={{ height: 40, width: 40, borderRadius: 8 }} />
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
