export default function Loading() {
  return (
    <div className="loading-page">
      <div className="loading-header">
        <div className="loading-header-left">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
        </div>
      </div>

      <div className="grid-2 align-start">
        {/* Card Kiri: Data Diri & Foto */}
        <div className="card">
          <div className="card-header">
            <div className="skeleton" style={{ height: 20, width: 200 }} />
          </div>
          
          <div className="card-body">
            {/* Avatar Upload Area Placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, gap: 12 }}>
              <div 
                className="skeleton"
                style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: '50%', 
                }}
              />
              <div className="skeleton" style={{ height: 32, width: 130 }} />
              <div className="skeleton" style={{ height: 12, width: 180 }} />
            </div>

            {/* Form Fields Placeholders */}
            <div className="form-group">
              <div className="skeleton" style={{ height: 16, width: 80, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 40, width: '100%' }} />
              <div className="skeleton" style={{ height: 12, width: 160, marginTop: 6 }} />
            </div>

            <div className="form-group">
              <div className="skeleton" style={{ height: 16, width: 110, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 40, width: '100%' }} />
            </div>

            <div className="form-group">
              <div className="skeleton" style={{ height: 16, width: 130, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 40, width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Card Kanan: Ubah Password */}
        <div className="card">
          <div className="card-header">
            <div className="skeleton" style={{ height: 20, width: 220 }} />
          </div>
          
          <div className="card-body">
            <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 24 }} />
            
            <div className="form-group">
              <div className="skeleton" style={{ height: 16, width: 110, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 40, width: '100%' }} />
            </div>
            
            <div className="form-group">
              <div className="skeleton" style={{ height: 16, width: 100, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 40, width: '100%' }} />
              <div className="skeleton" style={{ height: 12, width: 120, marginTop: 6 }} />
            </div>
            
            <div className="form-group">
              <div className="skeleton" style={{ height: 16, width: 180, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 40, width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Button Placeholder */}
      <div className="flex-end gap-3 mt-6" style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 20 }}>
        <div className="skeleton" style={{ height: 40, width: 150 }} />
      </div>
    </div>
  )
}
