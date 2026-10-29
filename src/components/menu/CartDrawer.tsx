import React, { useState } from 'react';
import { useMenuStore } from '../../store/useMenuStore';
import { useCreateOrder } from '../../hooks/useMenu';
import { formatPrice } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    diners,
    currency,
    tableNumber,
    isCartOpen,
    setIsCartOpen,
    addItemQuantity,
    removeItemQuantity,
    getTableTotal,
    addDiner,
    clearCart,
  } = useMenuStore();

  const [newDinerName, setNewDinerName] = useState('');
  const [showAddDiner, setShowAddDiner] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createOrderMutation = useCreateOrder();
  const tableTotal = getTableTotal(currency);

  if (!isCartOpen) return null;

  const handleAddDiner = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDinerName.trim()) {
      addDiner(newDinerName.trim(), false);
      setNewDinerName('');
      setShowAddDiner(false);
    }
  };

  const handleSendOrder = async () => {
    if (cart.length === 0) return;

    try {
      // Consolidar platillos de todos los comensales para la comanda de cocina
      const consolidatedItems: { quantity: number; name: string }[] = [];
      cart.forEach((item) => {
        const existing = consolidatedItems.find((ci) => ci.name === item.name);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          consolidatedItems.push({ quantity: item.quantity, name: item.name });
        }
      });

      const totalCRC = getTableTotal('CRC');
      const totalUSD = getTableTotal('USD');
      const tableName = tableNumber ? `Mesa #${tableNumber}` : 'Mesa General';

      await createOrderMutation.mutateAsync({
        tableNumber: tableName,
        items: consolidatedItems,
        totalCRC,
        totalUSD,
      });

      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        setIsSuccess(false);
        setIsCartOpen(false);
      }, 2500);
    } catch (err: any) {
      alert(`No se pudo enviar el pedido: ${err?.message || 'Error de conexión'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => !createOrderMutation.isPending && setIsCartOpen(false)}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col dot-pattern">
        {/* Header con título Pedido */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-gray-100 bg-white">
          <div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">
              Pedido
            </h2>
            <p className="text-[11px] text-gray-400 font-medium">
              {tableNumber ? `Asignado a Mesa #${tableNumber}` : 'Mesa General'}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mensaje de Confirmación tras enviar a cocina */}
        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1C3F32] flex items-center justify-center text-2xl shadow-inner">
              ✓
            </div>
            <h3 className="font-serif text-2xl font-bold text-gray-900">
              ¡Pedido recibido!
            </h3>
            <p className="text-xs text-gray-500 max-w-xs">
              Tu orden ha sido enviada al tablero de cocina y ya comenzó su preparación.
            </p>
          </div>
        ) : (
          <>
            {/* Lista de comensales y sus productos */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Tu pedido está vacío.</p>
                  <p className="text-xs mt-1">Explora la carta y agrega platillos para tu mesa.</p>
                </div>
              ) : (
                diners.map((diner) => {
                  const dinerItems = cart.filter((item) => item.dinerId === diner.id);
                  const dinerSubtotal = dinerItems.reduce((acc, item) => {
                    const price = currency === 'CRC' ? item.priceCRC : item.priceUSD;
                    return acc + price * item.quantity;
                  }, 0);

                  return (
                    <div key={diner.id} className="border-b border-gray-100/80 pb-4 last:border-none">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm text-gray-900">
                          {diner.name}
                        </span>
                        {!diner.hasPhone && (
                          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            sin celular
                          </span>
                        )}
                      </div>

                      {dinerItems.length === 0 ? (
                        <p className="text-xs text-gray-400 italic py-1">
                          Sin productos
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {dinerItems.map((item) => {
                            const itemPrice = currency === 'CRC' ? item.priceCRC : item.priceUSD;
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="font-bold text-gray-900">{item.quantity}×</span>
                                  <span className="font-semibold text-gray-800 uppercase tracking-wide truncate">
                                    {item.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-gray-900 whitespace-nowrap">
                                    {formatPrice(itemPrice * item.quantity, currency)}
                                  </span>

                                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                    <button
                                      onClick={() => removeItemQuantity(item.id)}
                                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                                    >
                                      -
                                    </button>
                                    <div className="w-[1px] h-4 bg-gray-200" />
                                    <button
                                      onClick={() => addItemQuantity(item.id)}
                                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-dashed border-gray-100">
                            <span>Subtotal</span>
                            <span className="font-semibold text-gray-800">
                              {formatPrice(dinerSubtotal, currency)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {cart.length > 0 && (
                <div>
                  {showAddDiner ? (
                    <form onSubmit={handleAddDiner} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nombre del comensal..."
                        value={newDinerName}
                        onChange={(e) => setNewDinerName(e.target.value)}
                        className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-green bg-white"
                      />
                      <button
                        type="submit"
                        className="bg-brand-green text-white text-xs font-semibold px-3 py-2 rounded-xl"
                      >
                        Agregar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddDiner(false)}
                        className="text-gray-400 text-xs px-2"
                      >
                        ✕
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowAddDiner(true)}
                      className="text-xs text-brand-green hover:underline font-semibold flex items-center gap-1 pt-1"
                    >
                      + Agregar otro comensal a la mesa
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer con Total y Enviar a Cocina */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-gray-900">Total de la mesa</span>
                  <span className="font-bold text-base text-gray-900">
                    {formatPrice(tableTotal, currency)}
                  </span>
                </div>

                <button
                  disabled={createOrderMutation.isPending}
                  onClick={handleSendOrder}
                  className="w-full bg-[#1C3F32] hover:bg-[#152e25] disabled:opacity-50 text-white py-3.5 rounded-2xl font-semibold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  {createOrderMutation.isPending ? (
                    <span>Enviando comanda a cocina...</span>
                  ) : (
                    <span>Enviar pedido</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
