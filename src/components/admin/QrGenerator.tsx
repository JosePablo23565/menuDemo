import React, { useState } from 'react';

export const QrGenerator: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const qrUrl = `${currentOrigin}/?mesa=${selectedTable}`;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
          CÓDIGOS QR DE MESAS
        </span>
        <h2 className="font-serif text-3xl font-bold text-gray-900">
          Generador de QR para Comensales
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Cada código QR asigna automáticamente el número de mesa en el celular del cliente.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-w-xl space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Selecciona el número de mesa:
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTable(t)}
                className={`w-10 h-10 rounded-2xl text-xs font-bold transition-all ${
                  selectedTable === t
                    ? 'bg-[#1C3F32] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-[#FBFBF9] rounded-2xl border border-gray-200/80 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Generador de QR dinámico a través de API rápida para demo */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                qrUrl
              )}`}
              alt={`QR Mesa ${selectedTable}`}
              className="w-44 h-44 object-contain rounded-lg"
            />
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-gray-900">Mesa #{selectedTable}</h4>
            <p className="text-[11px] text-gray-400 font-mono mt-1 break-all max-w-sm">
              {qrUrl}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.open(qrUrl, '_blank')}
              className="bg-[#1C3F32] hover:bg-[#142e25] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              Probar enlace directo ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
