import React, { useState } from 'react';
import { useKitchenOrders, useUpdateOrderStatus, useDeleteOrder } from '../../hooks/useMenu';
import { formatPrice } from '../../lib/utils';
import type { OrderStatus } from '../../types/database';

type KdsFilter = 'ACTIVAS' | 'NUEVOS' | 'EN_CURSO' | 'LISTOS' | 'HISTORIAL';

function getTimeAgo(isoString?: string): string {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Justo ahora';
  if (diffMins === 1) return 'Hace 1 min';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return 'Hace 1 hora';
  if (diffHours < 24) return `Hace ${diffHours} h`;
  return `Hace ${Math.floor(diffHours / 24)} d`;
}

function isOrderUrgent(isoString?: string, status?: OrderStatus): boolean {
  if (!isoString || status === 'entregado' || status === 'listo') return false;
  const diffMins = (Date.now() - new Date(isoString).getTime()) / 60000;
  return diffMins >= 20;
}

export const KitchenDisplaySystem: React.FC = () => {
  const { data: orders = [], isLoading } = useKitchenOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();
  const [filter, setFilter] = useState<KdsFilter>('ACTIVAS');

  // Separar activas (nuevo, en_curso, listo) de archivadas (entregado)
  const activeOrders = orders.filter((o) => o.status !== 'entregado');
  const deliveredOrders = orders.filter((o) => o.status === 'entregado');

  const countNuevos = orders.filter((o) => o.status === 'nuevo').length;
  const countEnCurso = orders.filter((o) => o.status === 'en_curso').length;
  const countListos = orders.filter((o) => o.status === 'listo').length;

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ACTIVAS') return o.status !== 'entregado';
    if (filter === 'NUEVOS') return o.status === 'nuevo';
    if (filter === 'EN_CURSO') return o.status === 'en_curso';
    if (filter === 'LISTOS') return o.status === 'listo';
    if (filter === 'HISTORIAL') return o.status === 'entregado';
    return true;
  });

  // Para cocina activa ordenamos por prioridad de espera (la más antigua primero = FIFO)
  // Para historial de archivadas, ordenamos de la más reciente a la más vieja
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (filter === 'HISTORIAL') {
      return timeB - timeA;
    }
    return timeA - timeB;
  });

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    updateStatusMutation.mutate({ orderId, status: nextStatus });
  };

  const handleDeleteOrder = (orderId: string, tableName: string) => {
    if (confirm(`¿Deseas eliminar definitivamente la comanda de ${tableName}?`)) {
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
            PANEL DE PRODUCCIÓN
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900">
            Comandas de Cocina
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {activeOrders.length === 1 ? '1 pedido activo' : `${activeOrders.length} pedidos activos`} en este turno
          </p>
        </div>

        {/* Filtros rápidos con contadores y pestaña Historial */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-black/[0.04] overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'ACTIVAS', label: 'Activas', count: activeOrders.length },
              { id: 'NUEVOS', label: 'Nuevas', count: countNuevos },
              { id: 'EN_CURSO', label: 'En preparación', count: countEnCurso },
              { id: 'LISTOS', label: 'Listas', count: countListos },
              { id: 'HISTORIAL', label: 'Historial', count: deliveredOrders.length },
            ] as const
          ).map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as KdsFilter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-gray-900 shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-[#1C3F32] text-white'
                        : 'bg-stone-200/80 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">
          Cargando pedidos de cocina...
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-white rounded-3xl border border-black/[0.05] shadow-xs space-y-2">
          <p className="font-serif text-2xl text-gray-700">
            {filter === 'HISTORIAL'
              ? 'No hay comandas en el historial'
              : 'Sin comandas en esta sección'}
          </p>
          <p className="text-xs max-w-sm mx-auto text-gray-400">
            {filter === 'HISTORIAL'
              ? 'Las comandas que marques como entregadas aparecerán aquí.'
              : 'Los pedidos que envíen las mesas aparecerán organizados aquí en tiempo real.'}
          </p>
        </div>
      ) : (
        /* Cuadrícula limpia y uniforme con tarjetas de altura pareja */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedOrders.map((order) => {
            const isNuevo = order.status === 'nuevo';
            const isEnCurso = order.status === 'en_curso';
            const isListo = order.status === 'listo';
            const isEntregado = order.status === 'entregado';
            const isUrgent = isOrderUrgent(order.createdAt, order.status);

            const statusBadgeConfig = {
              nuevo: {
                bg: 'bg-amber-50 text-amber-800 border-amber-200',
                dot: 'bg-amber-500',
                label: 'Nuevo pedido',
              },
              en_curso: {
                bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                dot: 'bg-emerald-500 animate-pulse',
                label: 'En preparación',
              },
              listo: {
                bg: 'bg-blue-50 text-blue-800 border-blue-200',
                dot: 'bg-blue-500',
                label: 'Listo en barra',
              },
              entregado: {
                bg: 'bg-stone-100 text-stone-600 border-stone-200',
                dot: 'bg-stone-400',
                label: 'Entregado / Archivado',
              },
            }[order.status] || {
              bg: 'bg-gray-100 text-gray-700 border-gray-200',
              dot: 'bg-gray-400',
              label: 'En proceso',
            };

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative h-[340px] ${
                  isUrgent
                    ? 'border-amber-300 ring-2 ring-amber-400/20'
                    : 'border-black/[0.06]'
                }`}
              >
                {/* Botón sutil de descartar/eliminar */}
                <button
                  onClick={() => handleDeleteOrder(order.id, order.tableNumber)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition-colors"
                  title="Eliminar comanda permanentemente"
                  aria-label="Eliminar comanda"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div>
                  {/* Cabecera de la comanda: Mesa, Estado y Tiempo transcurrido */}
                  <div className="pb-3 border-b border-gray-100 pr-8">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeConfig.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadgeConfig.dot}`} />
                        {statusBadgeConfig.label}
                      </span>

                      {isUrgent && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                          Demora +20m
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                      {order.tableNumber}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mt-1">
                      <span>{formatOrderTime(order.createdAt)}</span>
                      <span>·</span>
                      <span className="text-gray-500 font-semibold">{getTimeAgo(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* Lista de productos con scroll interno para que ninguna tarjeta descuadre la altura */}
                  <div className="py-3 max-h-[140px] overflow-y-auto no-scrollbar space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-extrabold text-[#1C3F32] bg-emerald-50/90 border border-emerald-100/80 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          {item.quantity}×
                        </span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm tracking-wide uppercase leading-snug">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer de la comanda con Total y Botones de acción */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto shrink-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Total</span>
                    <span className="font-mono font-bold text-sm sm:text-base text-gray-900 tabular-nums">
                      {formatPrice(order.totalCRC, 'CRC')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isNuevo && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'en_curso')}
                        className="bg-[#1C3F32] hover:bg-[#152e25] active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-transform"
                      >
                        Iniciar preparación
                      </button>
                    )}

                    {isEnCurso && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'listo')}
                        className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-transform"
                      >
                        Marcar listo
                      </button>
                    )}

                    {isListo && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'entregado')}
                        className="bg-stone-100 hover:bg-stone-200 active:scale-95 text-gray-800 px-3.5 py-2 rounded-xl text-xs font-semibold border border-black/[0.05] transition-transform"
                      >
                        Archivar comanda
                      </button>
                    )}

                    {isEntregado && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'nuevo')}
                        className="text-gray-400 hover:text-gray-700 hover:bg-stone-100 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors border border-black/[0.04]"
                        title="Devolver a cocina"
                      >
                        Reabrir
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
