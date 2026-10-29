import React, { useState } from 'react';
import { useKitchenOrders, useUpdateOrderStatus, useDeleteOrder } from '../../hooks/useMenu';
import { formatPrice } from '../../lib/utils';
import type { OrderStatus } from '../../types/database';

export const KitchenDisplaySystem: React.FC = () => {
  const { data: orders = [], isLoading } = useKitchenOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();
  const [filter, setFilter] = useState<'TODOS' | 'NUEVOS' | 'EN_CURSO' | 'LISTOS'>('TODOS');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'NUEVOS') return o.status === 'nuevo';
    if (filter === 'EN_CURSO') return o.status === 'en_curso';
    if (filter === 'LISTOS') return o.status === 'listo';
    return true;
  });

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    updateStatusMutation.mutate({ orderId, status: nextStatus });
  };

  const handleDeleteOrder = (orderId: string, tableName: string) => {
    if (confirm(`¿Deseas retirar la comanda de ${tableName}?`)) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const formatOrderTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del KDS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-black/[0.05] shadow-xs">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900">
            Comandas
          </h2>
        </div>

        {/* Filtros rápidos tipo píldoras sobrias */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-black/[0.04]">
          {(['TODOS', 'NUEVOS', 'EN_CURSO', 'LISTOS'] as const).map((tab) => {
            const labels = {
              TODOS: 'Todas',
              NUEVOS: 'Nuevas',
              EN_CURSO: 'En preparación',
              LISTOS: 'Listas',
            };
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === tab
                    ? 'bg-white text-gray-900 shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">
          Cargando pedidos de cocina...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-white rounded-3xl border border-black/[0.05] shadow-xs">
          <p className="font-serif text-2xl text-gray-700 mb-1">Sin comandas pendientes</p>
          <p className="text-xs max-w-sm mx-auto">
            Los pedidos enviados desde las mesas aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => {
            const isNuevo = order.status === 'nuevo';
            const isEnCurso = order.status === 'en_curso';
            const isListo = order.status === 'listo';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group"
              >
                {/* Botón sutil de descartar/eliminar */}
                <button
                  onClick={() => handleDeleteOrder(order.id, order.tableNumber)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition-colors"
                  title="Eliminar comanda"
                  aria-label="Eliminar comanda"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div>
                  {/* Cabecera de la comanda: Mesa y Hora */}
                  <div className="pb-3 border-b border-gray-100 pr-8 flex items-baseline justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
                        {order.tableNumber}
                      </h3>
                      {order.createdAt && (
                        <span className="text-[11px] text-gray-400 font-medium">
                          Hora: {formatOrderTime(order.createdAt)}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isNuevo
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : isEnCurso
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 animate-pulse'
                          : 'bg-stone-100 text-gray-700'
                      }`}
                    >
                      {isNuevo ? 'Nuevo' : isEnCurso ? 'Preparando' : 'Listo'}
                    </span>
                  </div>

                  {/* Lista de productos con cantidades destacadas en alta legibilidad para cocina */}
                  <div className="py-4 space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="font-mono text-sm font-extrabold text-[#1C3F32] bg-emerald-50/80 border border-emerald-100 w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                          {item.quantity}×
                        </span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm tracking-wide uppercase">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la comanda con Total y Botones de acción táctiles para cocina */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <span className="font-mono font-bold text-xs text-gray-600">
                    {formatPrice(order.totalCRC, 'CRC')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isNuevo && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'en_curso')}
                        className="bg-[#1C3F32] hover:bg-[#152e25] active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-transform"
                      >
                        Iniciar preparación
                      </button>
                    )}

                    {isEnCurso && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'listo')}
                        className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-transform"
                      >
                        Marcar listo
                      </button>
                    )}

                    {isListo && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'entregado')}
                        className="bg-stone-100 hover:bg-stone-200 active:scale-95 text-gray-800 px-4 py-2.5 rounded-xl text-xs font-bold border border-black/[0.05] transition-transform"
                      >
                        Archivar comanda
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
