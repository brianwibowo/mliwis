import { Waves, Zap, ShieldCheck } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-container" id="auth-split-layout">
      {/* Left panel: 50% Visual info (Hidden on Mobile) */}
      <div className="auth-left-panel" id="auth-visual-panel">
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <div className="auth-tagline-badge" id="auth-portal-tagline">
            <Waves size={14} />
            <span>PORTAL RESMI PENGELOLA</span>
          </div>
          <h1 className="auth-panel-title" id="auth-portal-title">
            Sistem Informasi Manajemen <br />
            <span className="auth-title-highlight">Pantai Mliwis</span>
          </h1>
          <p className="auth-panel-desc" id="auth-portal-desc">
            Halaman khusus bagi petugas pengelola untuk mengatur arsip surat, reservasi tempat, laporan keuangan, dan pencatatan pengunjung harian Pantai Mliwis secara mudah dan rapi.
          </p>

          <div className="auth-panel-features" id="auth-portal-features">
            <div className="auth-feature-item" id="auth-feature-speed">
              <span className="auth-feature-icon">
                <Zap size={18} />
              </span>
              <div>
                <h4>Layanan Cepat</h4>
                <p>Pengolahan data dan pembuatan laporan jadi lebih praktis</p>
              </div>
            </div>
            <div className="auth-feature-item" id="auth-feature-security">
              <span className="auth-feature-icon">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h4>Data Aman</h4>
                <p>Akses masuk yang aman khusus untuk pengelola</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: 50% Form */}
      <div className="auth-right-panel" id="auth-form-panel">
        {children}
      </div>
    </div>
  )
}
