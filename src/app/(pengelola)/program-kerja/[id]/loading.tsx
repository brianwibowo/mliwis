export default function Loading() {
  return (
    <div className="loading-page">
      <div className="loading-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="skeleton" style={{ height: 36, width: 36, borderRadius: 8 }} />
          <div className="loading-header-left">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-subtitle" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton" style={{ height: 40, width: 100 }} />
          <div className="skeleton" style={{ height: 40, width: 100 }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 14 }} />
      </div>
      <div className="skeleton" style={{ height: 50, borderRadius: 14, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 300, borderRadius: 14 }} />
    </div>
  )
}
