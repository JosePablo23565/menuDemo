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
    <div className="flex min-h-[75vh] items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8 shadow-xl border border-black/[0.06] rounded-3xl bg-white">
        <div className="text-center mb-7">
          <div className="mx-auto w-16 h-16 rounded-full overflow-hidden shadow-xs border border-black/10 shrink-0 bg-[#36432b] mb-4">
            <img
              src="/logo.png"
              alt="Casa Tamarindo"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
            Casa Tamarindo
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Acceso administrativo y cocina
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@casatamarindo.cr"
              className="w-full rounded-2xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1C3F32] focus:outline-none focus:ring-1 focus:ring-[#1C3F32] bg-stone-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1C3F32] focus:outline-none focus:ring-1 focus:ring-[#1C3F32] bg-stone-50/50"
            />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full bg-[#1C3F32] hover:bg-[#142e25] text-white py-3.5 rounded-2xl text-xs font-semibold shadow-sm transition-transform active:scale-[0.98] mt-2"
            isLoading={isLoading}
          >
            Ingresar al panel
          </Button>
        </form>
      </Card>
    </div>
  );
};
