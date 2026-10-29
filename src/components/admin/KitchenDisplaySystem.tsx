import React, { useState } from 'react';
import type { KitchenOrder, OrderStatus } from '../../types/database';
import { formatPrice } from '../../lib/utils';

// Pedidos mock iniciales que emulan la captura del usuario para que el tablero no se vea vacío
const INITIAL_KITCHEN_ORDERS: KitchenOrder[] = [
  {
    id: 'ord-1',
    tableNumber: 'Mesa 4',
    status: 'nuevo',
    items: [
      { quantity: 1, name: 'PENICILLIN' },
      { quantity: 2, name: 'KETEL ONE' },
      { quantity: 1, name: 'GLENFIDDICH 15 AÑOS' },
    ],
    totalCRC: 151000,
    totalUSD: 38.0,
    createdAt: 'Hace 3 min',
  },
  {
    id: 'ord-2',
    tableNumber: 'Mesa 2',
    status: 'en_curso',
    items: [
      { quantity: 2, name: 'AREPA DE CHOCOLO' },
      { quantity: 2, name: 'CLUB COLOMBIA ROJA' },
      { quantity: 1, name: 'PAPITAS RELLENAS' },
      { quantity: 2, name: 'SODAS SABORIZADAS' },
    ],
    totalCRC: 123000,
    totalUSD: 31.0,
    createdAt: 'Hace 8 min',
  },
  {
    id: 'ord-3',
    tableNumber: 'Mesa 7',
    status: 'nuevo',
    items: [
      { quantity: 1, name: 'CAFÉ DE TEMPORADA CHEMEX' },
      { quantity: 1, name: 'LA GUAPA' },
      { quantity: 2, name: 'SUDAO DE POSTA' },
      { quantity: 2, name: 'CAFÉ DE TEMPORADA CHEMEX' },
      { quantity: 2, name: 'ARROZ CON HUEVO' },
      { quantity: 2, name: 'PASTELITOS DE POLLO' },
    ],
    totalCRC: 240000,
    totalUSD: 60.0,
    createdAt: 'Hace 1 min',
  },
  {
    id: 'ord-4',
    tableNumber: 'Mesa 1',
    status: 'en_curso',
    items: [
      { quantity: 1, name: 'FEIJOA Y LULO' },
      { quantity: 2, name: 'TAMAL' },
      { quantity: 1, name: 'GUABILAQUE' },
      { quantity: 1, name: 'BEEFEATER' },
    ],
    totalCRC: 98000,
    totalUSD: 24.5,
    createdAt: 'Hace 12 min',
  },
];

export const KitchenDisplaySystem: React.FC = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_KITCHEN_ORDERS);
  const [filter, setFilter] = useState<'TODOS' | 'NUEVOS' | 'EN_CURSO' | 'LISTOS'>('TODOS');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'NUEVOS') return o.status === 'nuevo';
    if (filter === 'EN_CURSO') return o.status === 'en_curso';
    if (filter === 'LISTOS') return o.status === 'listo';
    return true;
  });

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header del Tablero de Cocina */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
            TABLERO DE COCINA
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900">
            Pedidos activos
          </h2>
        </div>

        {/* Pestañas de filtro de estado (NUEVOS, EN CURSO, LISTOS) */}
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

      {/* Grilla de Tarjetas de Comandas de Cocina */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
            <p className="text-sm">No hay pedidos en este estado.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isNuevo = order.status === 'nuevo';
            const isEnCurso = order.status === 'en_curso';
            const isListo = order.status === 'listo';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-gray-100/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
              >
                <div>
                  {/* Cabecera de la comanda con Mesa y Badge de Estado */}
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-gray-100">
                    <h3 className="font-serif text-2xl font-bold text-gray-900">
                      {order.tableNumber}
                    </h3>

                    {/* Badge de estado exacto a la captura */}
                    {isNuevo && (
                      <span className="bg-[#1C3F32] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
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

                  {/* Lista de productos solicitados */}
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

                {/* Footer de la comanda con Total y Botón de acción */}
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
          })
        )}
      </div>
    </div>
  );
};
