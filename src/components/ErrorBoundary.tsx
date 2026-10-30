import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error no controlado en la aplicación:', error, errorInfo);
    // Auto-recuperación transparente: si la caché o sesión previa tenía datos desactualizados,
    // limpia automáticamente y recarga al instante sin molestar al cliente
    try {
      const recovered = sessionStorage.getItem('ct_auto_recovered');
      if (!recovered) {
        sessionStorage.setItem('ct_auto_recovered', 'true');
        localStorage.removeItem('la-terraza-session');
        window.location.reload();
      }
    } catch {}
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl border border-black/[0.08] shadow-sm max-w-sm w-full space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-[#1C3F32] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold text-gray-900">
              Actualizando carta
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hemos renovado el menú. Toca el botón para cargar la versión más reciente.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-[#1C3F32] hover:bg-[#152e25] text-white py-3 px-4 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-xs"
            >
              Recargar menú
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
