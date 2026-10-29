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
    if (confirm(`¿Deseas eliminar la comanda de ${tableName}?`)) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
            TABLERO DE COCINA
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900">
            Pedidos activos
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-gray-100 shadow-2xs">
          {(['TODOS', 'NUEVOS', 'EN_CURSO', 'LISTOS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all ${
                filter === tab
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">
          Cargando pedidos en vivo...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
          <p className="font-serif text-xl text-gray-700 mb-1">Sin comandas activas</p>
          <p className="text-xs">Los pedidos enviados desde los celulares de las mesas aparecerán aquí al instante.</p>
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
                className="bg-white rounded-3xl p-5 border border-gray-100/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group"
              >
                {/* Ícono sutil de basurero en la parte superior derecha exacta */}
                <button
                  onClick={() => handleDeleteOrder(order.id, order.tableNumber)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition-all"
                  title="Eliminar comanda"
                  aria-label="Eliminar comanda"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div>
                  {/* Cabecera limpia: Solo Mesa y Hora, sin badges de NUEVO */}
                  <div className="pb-3 border-b border-dashed border-gray-100 pr-8">
                    <h3 className="font-serif text-2xl font-bold text-gray-900">
                      {order.tableNumber}
                    </h3>
                    {order.createdAt && (
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatOrderTime(order.createdAt)}
                      </span>
                    )}
                  </div>

                  {/* Lista de productos */}
                  <div className="py-4 space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <span className="font-extrabold text-gray-900 w-5">
                          {item.quantity}×
                        </span>
                        <span className="font-semibold text-gray-800 uppercase tracking-wide">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la comanda con Total y Acción */}
                <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <span className="font-bold text-xs text-gray-900">
                    {formatPrice(order.totalCRC, 'CRC')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isNuevo && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'en_curso')}
                        className="bg-[#1C3F32] hover:bg-[#142e25] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
                      >
                        Iniciar pedido
                      </button>
                    )}

                    {isEnCurso && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'listo')}
                        className="bg-[#D97706] hover:bg-[#b45309] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
                      >
                        Marcar listo
                      </button>
                    )}

                    {isListo && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'entregado')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                      >
                        Archivar
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
