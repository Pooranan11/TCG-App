import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyOrders } from '../api/orders'
import type { Order } from '../types'
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLE } from '../utils/labels'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyOrders()
      .then((data) => { setOrders(data); setLoading(false) })
      .catch(() => { setError('Impossible de charger vos commandes.'); setLoading(false) })
  }, [])

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
      <div className="mb-8">
        <p className="font-condensed font-bold text-[0.7rem] tracking-[0.2em] uppercase text-yellow mb-0.5">
          Mon compte
        </p>
        <h1 className="font-condensed font-black text-3xl uppercase text-navy">
          Mes commandes
        </h1>
      </div>

      {loading && <p className="text-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-16">
          <p className="font-condensed font-bold text-lg uppercase text-navy/30 mb-6">
            Aucune commande pour le moment
          </p>
          <Link
            to="/products"
            className="inline-block font-condensed font-black text-[0.85rem] tracking-[0.12em] uppercase bg-yellow text-navy px-8 py-3 hover:bg-yellow-light transition-colors"
          >
            Voir le catalogue
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-navy/10 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-condensed font-black text-navy text-sm uppercase tracking-wide">
                  Commande #{order.id}
                </p>
                <p className="text-muted text-[0.75rem] mt-0.5">
                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-condensed font-bold text-[0.65rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded ${ORDER_STATUS_STYLE[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
                <span className="font-condensed font-black text-xl text-navy">
                  {order.total.toFixed(2)} €
                </span>
              </div>
            </div>

            {order.items.length > 0 && (
              <div className="border-t border-navy/5 pt-3 flex flex-col gap-1.5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-[0.78rem] text-muted">
                    <span>Article #{item.product_id} × {item.quantity}</span>
                    <span>{(item.unit_price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
