import React from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import { useActiveClientOrder } from '../../hooks/useMenu';
import { formatPrice } from '../../lib/utils';
import { Modal } from '../ui/Modal';

export const OrderStatusBanner: React.FC = () => {
  const {
    activeOrderId,
    isOrderModalOpen,
    setIsOrderModalOpen,
    currency,
    setActiveOrderId,
  } = useMenuStore();

  const { data: order } = useActiveClientOrder(activeOrderId);

  if (!order || order.status === 'entregado') {
    return null;
  }

  const statusConfig = {
    nuevo: {
      dotColor: 'bg-amber-400',
      label: 'Recibido en cocina',
    },
    en_curso: {
      dotColor: 'bg-emerald-400 animate-pulse',
      label: 'En preparación',
    },
    listo: {
      dotColor: 'bg-emerald-300',
      label: 'Listo para servir',
    },
    entregado: {
      dotColor: 'bg-gray-400',
      label: 'Entregado',
    },
  }[order.status] || {
    dotColor: 'bg-gray-400',
    label: 'En proceso',
  };

  const currentTotal = currency === 'CRC' ? order.totalCRC : order.totalUSD;
  const totalItemsCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <>
      {/* Barra fija inferior sobria y minimalista: sin emojis ni saturación */}
      <div className="fixed bottom-20 inset-x-0 z-30 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-[#1C3F32] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between border border-emerald-900/40">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusConfig.dotColor}`} />
              <div className="truncate">
                <p className="text-xs font-semibold tracking-tight text-white">
                  {order.tableNumber} · {statusConfig.label}
                </p>
                <p className="text-[11px] text-emerald-100/75 font-medium">
                  {formatPrice(currentTotal, currency)} · {totalItemsCount} {totalItemsCount === 1 ? 'platillo' : 'platillos'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0"
            >
              Ver
            </button>
          </div>
        </div>
      </div>

      {/* Detalle modal del pedido */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Detalle del pedido"
      >
        <div className="space-y-4 text-xs text-gray-700">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-sm text-gray-900">{order.tableNumber}</p>
              <p className="text-gray-400 text-[11px]">
                {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[#1C3F32]/10 text-[#1C3F32] font-semibold px-2.5 py-1 rounded-full text-[11px]">
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
              {statusConfig.label}
            </span>
          </div>

          {/* Desglose de productos */}
          <div className="space-y-2 py-1 max-h-56 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-none">
                <span className="font-medium text-gray-800">
                  {item.quantity}× {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(currentTotal, currency)}</span>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                setActiveOrderId(null);
                setIsOrderModalOpen(false);
              }}
              className="text-gray-400 hover:text-red-600 px-3 py-2.5 text-[11px] font-medium"
            >
              Finalizar mesa
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
