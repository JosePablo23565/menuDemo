import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface AdminLoginProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  isLoading?: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onLogin(email.trim(), password.trim());
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="flex min-h-[65vh] items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 shadow-xl border border-gray-100 rounded-3xl">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-emerald-50 text-brand-green rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Panel de Administración</h2>
          <p className="text-xs text-gray-400 mt-1">Ingresa con tu cuenta de Supabase</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@laterraza.com"
              className="w-full rounded-2xl border border-gray-200 px-3.5 py-2.5 text-xs focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-gray-200 px-3.5 py-2.5 text-xs focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-[#1C3F32] hover:bg-[#142e25] text-white py-3 rounded-2xl text-xs font-semibold shadow-sm"
            isLoading={isLoading}
          >
            Iniciar Sesión
          </Button>
        </form>
      </Card>
    </div>
  );
};
