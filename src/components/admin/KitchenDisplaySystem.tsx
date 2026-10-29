import React, { useState } from 'react';
import { useKitchenOrders, useUpdateOrderStatus } from '../../hooks/useMenu';
import { formatPrice } from '../../lib/utils';
import type { OrderStatus } from '../../types/database';

export const KitchenDisplaySystem: React.FC = () => {
  const { data: orders = [], isLoading } = useKitchenOrders();
  const updateStatusMutation = useUpdateOrderStatus();
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
                className="bg-white rounded-3xl p-5 border border-gray-100/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-gray-100">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-gray-900">
                        {order.tableNumber}
                      </h3>
                      {order.createdAt && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          {formatOrderTime(order.createdAt)}
                        </span>
                      )}
                    </div>

                    {isNuevo && (
                      <span className="bg-[#1C3F32] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider animate-pulse">
                        Nuevo
                      </span>
                    )}
                    {isEnCurso && (
                      <span className="bg-[#FEF08A] text-amber-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                        En curso
                      </span>
                    )}
                    {isListo && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                        Listo
                      </span>
                    )}
                  </div>

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

                <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <span className="font-bold text-xs text-gray-900">
                    {formatPrice(order.totalCRC, 'CRC')}
                  </span>

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
            );
          })}
        </div>
      )}
    </div>
  );
};
