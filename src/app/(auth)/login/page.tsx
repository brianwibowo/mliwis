'use client'

import { useActionState } from 'react'
import { loginAction, LoginState } from '../actions'
import { Waves, Lock, User } from 'lucide-react'

const initialState: LoginState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <div className="auth-logo-icon">
          <Waves size={40} />
        </div>
        <h1 className="auth-title">SI-Mliwis</h1>
        <p className="auth-subtitle">Sistem Informasi Manajemen Pantai Mliwis</p>
      </div>

      <form action={formAction} className="auth-form">
        {state.error && (
          <div className="alert alert-danger">
            {state.error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <div className="form-input-wrapper">
            <User size={18} className="form-input-icon" />
            <input
              id="username"
              name="username"
              type="text"
              className="form-input form-input-with-icon"
              placeholder="Masukkan username"
              required
              autoComplete="username"
              autoFocus
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="form-input-wrapper">
            <Lock size={18} className="form-input-icon" />
            <input
              id="password"
              name="password"
              type="password"
              className="form-input form-input-with-icon"
              placeholder="Masukkan password"
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          disabled={pending}
        >
          {pending ? (
            <>
              <span className="spinner spinner-sm"></span>
              Memproses...
            </>
          ) : (
            'Masuk'
          )}
        </button>
      </form>

      <p className="auth-footer-text">
        Pantai Mliwis &mdash; Kebumen
      </p>
    </div>
  )
}
