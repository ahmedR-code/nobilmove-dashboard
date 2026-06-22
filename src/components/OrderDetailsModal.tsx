import React, { useState, useEffect } from 'react'
import { X, User, MapPin, CreditCard, Truck, AlertCircle, RefreshCw } from 'lucide-react'
import api from '../lib/api'
import { toast } from 'sonner'

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  isArabic: boolean
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  orderId,
  isArabic,
}) => {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails()
    } else {
      setOrder(null)
    }
  }, [isOpen, orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/orders/${orderId}`)
      setOrder(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error(isArabic ? 'فشل في تحميل تفاصيل الطلب' : 'Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Translating helpers
  const translateService = (val: string) => {
    if (!val) return ''
    const mapping: Record<string, string> = {
      'نقل أثاث': 'Furniture Moving',
      'سحب سيارة': 'Car Towing',
      'مكافحة حشرات': 'Pest Control',
      'تنظيف منازل': 'Home Cleaning',
      'نقل بضائع': 'Goods Transport',
    }
    return isArabic ? val : (mapping[val] || val)
  }

  const translateRegion = (val: string) => {
    if (!val) return ''
    const mapping: Record<string, string> = {
      'الرياض': 'Riyadh',
      'جدة': 'Jeddah',
      'الدمام': 'Dammam',
      'مكة المكرمة': 'Makkah',
      'المدينة المنورة': 'Madinah',
    }
    return isArabic ? val : (mapping[val] || val)
  }

  const translateStatus = (val: string) => {
    if (!val) return ''
    const norm = val.toLowerCase()
    if (norm === 'in_progress' || norm === 'in progress' || norm === 'قيد التنفيذ') return isArabic ? 'قيد التنفيذ' : 'In Progress'
    if (norm === 'completed' || norm === 'مكتمل') return isArabic ? 'مكتمل' : 'Completed'
    if (norm === 'cancelled' || norm === 'ملغي') return isArabic ? 'ملغي' : 'Cancelled'
    if (norm === 'pending' || norm === 'قيد الانتظار') return isArabic ? 'قيد الانتظار' : 'Pending'
    if (norm === 'accepted' || norm === 'مقبول') return isArabic ? 'مقبول' : 'Accepted'
    return val
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all transform scale-100 max-h-[90vh] flex flex-col"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {isArabic ? 'تفاصيل الطلب' : 'Order Details'}
            </h3>
            {orderId && (
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-500 border border-slate-200 dark:border-slate-700">
                #{orderId}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RefreshCw className="animate-spin mb-4" size={24} />
              <p>{isArabic ? 'جاري التحميل...' : 'Loading details...'}</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              
              {/* Order Status & Primary Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    {isArabic ? 'حالة الطلب' : 'Order Status'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-500">
                      {translateStatus(order.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    {isArabic ? 'نوع الخدمة' : 'Service Type'}
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {translateService(order.service)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    {isArabic ? 'التكلفة الإجمالية' : 'Total Cost'}
                  </p>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {isArabic ? 'ر.س' : 'SAR'} {(order.totalPrice ?? order.price ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Customer Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    {isArabic ? 'بيانات العميل' : 'Customer Details'}
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">{isArabic ? 'الاسم' : 'Name'}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {order.customer?.name || order.customer || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{isArabic ? 'رقم الهاتف' : 'Phone'}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300" dir="ltr">
                        {order.customer?.phoneNumber || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Provider Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Truck size={16} className="text-slate-400" />
                    {isArabic ? 'مقدم الخدمة' : 'Service Provider'}
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    {order.provider ? (
                      <>
                        <div>
                          <p className="text-xs text-slate-400">{isArabic ? 'الاسم' : 'Name'}</p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {order.provider.name || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{isArabic ? 'رقم الهاتف' : 'Phone'}</p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300" dir="ltr">
                            {order.provider.phoneNumber || '-'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-500 py-2">
                        <AlertCircle size={16} />
                        <p className="text-sm font-medium">
                          {isArabic ? 'لم يتم تعيين مقدم خدمة' : 'No provider assigned'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location & Time */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" />
                    {isArabic ? 'الموقع والتاريخ' : 'Location & Time'}
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">{isArabic ? 'المنطقة' : 'Region'}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {translateRegion(order.region)}
                      </p>
                    </div>
                    {order.location && (
                      <div>
                        <p className="text-xs text-slate-400">{isArabic ? 'العنوان' : 'Address'}</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {order.location}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-400">{isArabic ? 'تاريخ الإنشاء' : 'Created At'}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300" dir="ltr">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <CreditCard size={16} className="text-slate-400" />
                    {isArabic ? 'الدفع والتفاصيل' : 'Payment & Details'}
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <div>
                      <p className="text-xs text-slate-400">{isArabic ? 'طريقة الدفع' : 'Payment Method'}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {order.payment?.method || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{isArabic ? 'حالة الدفع' : 'Payment Status'}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {order.payment?.status || '-'}
                      </p>
                    </div>
                    {order.distance && (
                      <div>
                        <p className="text-xs text-slate-400">{isArabic ? 'المسافة' : 'Distance'}</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {order.distance} {isArabic ? 'كم' : 'km'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <AlertCircle className="mb-4" size={24} />
              <p>{isArabic ? 'الطلب غير موجود' : 'Order not found'}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
