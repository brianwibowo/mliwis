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
      <div className="skeleton-card">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton-table-row">
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
