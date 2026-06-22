import React, { useState, useEffect } from 'react'
import { X, Save, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import api from '../lib/api'
import { toast } from 'sonner'

interface ManageOrderModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  isArabic: boolean
  onSuccess: () => void
}

export const ManageOrderModal: React.FC<ManageOrderModalProps> = ({
  isOpen,
  onClose,
  orderId,
  isArabic,
  onSuccess
}) => {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [providers, setProviders] = useState<any[]>([])
  
  // Form state
  const [status, setStatus] = useState('')
  const [providerId, setProviderId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails()
    } else {
      setOrder(null)
      setProviders([])
      setStatus('')
      setProviderId('')
    }
  }, [isOpen, orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/orders/${orderId}`)
      const orderData = response.data.data || response.data
      setOrder(orderData)
      setStatus(orderData.status || '')
      setProviderId(orderData.provider?._id || orderData.provider?.id || '')
      
      // Fetch suitable providers based on service type
      fetchProviders(orderData.service)
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error(isArabic ? 'فشل في تحميل تفاصيل الطلب' : 'Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const fetchProviders = async (serviceType: string) => {
    try {
      // Pass serviceType to only get providers that do this service, use high limit for select box
      const response = await api.get('/admin/providers', {
        params: { limit: 100, serviceType }
      })
      setProviders(response.data.data || [])
    } catch (error) {
      console.error('Error fetching providers:', error)
    }
  }

  const handleUpdate = async () => {
    if (!orderId) return
    setIsSaving(true)
    let needsRefresh = false

    try {
      // 1. Update Status if changed
      if (status && status !== order.status) {
        await api.put(`/admin/orders/${orderId}/status`, { status })
        needsRefresh = true
      }

      // 2. Update Provider if changed
      const currentProviderId = order.provider?._id || order.provider?.id || ''
      if (providerId !== currentProviderId) {
        if (!providerId) {
          // If clearing provider, API might not support it unless it takes null, but let's assume it only supports assigning
          // For now just assign if providerId is present
        } else {
          await api.put(`/admin/orders/${orderId}/assign-provider`, { providerId })
          needsRefresh = true
        }
      }

      if (needsRefresh) {
        toast.success(isArabic ? 'تم تحديث الطلب بنجاح' : 'Order updated successfully')
        onSuccess()
        onClose()
      } else {
        toast.info(isArabic ? 'لم يتم إجراء أي تغييرات' : 'No changes made')
        onClose()
      }
    } catch (error: any) {
      console.error('Error updating order:', error)
      toast.error(isArabic ? 'فشل في تحديث الطلب' : 'Failed to update order')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!orderId) return
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا الطلب نهائياً؟' : 'Are you sure you want to permanently delete this order?')) return

    try {
      setIsDeleting(true)
      await api.delete(`/admin/orders/${orderId}`)
      toast.success(isArabic ? 'تم حذف الطلب بنجاح' : 'Order deleted successfully')
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Error deleting order:', error)
      toast.error(isArabic ? 'فشل في حذف الطلب' : 'Failed to delete order')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  const statuses = [
    { value: 'قيد الانتظار', en: 'pending', ar: 'قيد الانتظار' },
    { value: 'مقبول', en: 'accepted', ar: 'مقبول' },
    { value: 'قيد التنفيذ', en: 'in_progress', ar: 'قيد التنفيذ' },
    { value: 'مكتمل', en: 'completed', ar: 'مكتمل' },
    { value: 'ملغي', en: 'cancelled', ar: 'ملغي' },
  ]

  // Find English label for fallback/UI matching
  const getStatusLabel = (val: string) => {
    const s = statuses.find(x => x.value === val || x.en === val.toLowerCase() || x.ar === val)
    if (!s) return val
    return isArabic ? s.ar : (s.en.charAt(0).toUpperCase() + s.en.slice(1).replace('_', ' '))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all transform scale-100"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {isArabic ? 'إدارة الطلب' : 'Manage Order'} #{orderId}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RefreshCw className="animate-spin mb-4" size={24} />
              <p>{isArabic ? 'جاري التحميل...' : 'Loading details...'}</p>
            </div>
          ) : order ? (
            <div className="space-y-5">
              
              {/* Status Update */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {isArabic ? 'تحديث الحالة' : 'Update Status'}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {statuses.map(s => (
                    <option key={s.value} value={s.value}>
                      {isArabic ? s.ar : s.en.charAt(0).toUpperCase() + s.en.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                  {!statuses.find(s => s.value === status || s.en === status || s.ar === status) && status && (
                    <option value={status}>{getStatusLabel(status)}</option>
                  )}
                </select>
              </div>

              {/* Provider Assignment */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {isArabic ? 'تعيين مقدم خدمة' : 'Assign Provider'}
                </label>
                <select
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">
                    {isArabic ? 'بدون مقدم خدمة' : 'No provider assigned'}
                  </option>
                  {providers.map(p => (
                    <option key={p._id || p.id} value={p._id || p.id}>
                      {p.name} ({p.phoneNumber})
                    </option>
                  ))}
                  {providerId && !providers.find(p => (p._id || p.id) === providerId) && order.provider && (
                    <option value={providerId}>
                      {order.provider.name} ({order.provider.phoneNumber})
                    </option>
                  )}
                </select>
                {providers.length === 0 && (
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {isArabic ? 'لا يوجد مقدمي خدمة متاحين لهذه الخدمة' : 'No providers available for this service type'}
                  </p>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || isSaving}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  <span>{isArabic ? 'حذف الطلب' : 'Delete'}</span>
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    disabled={isDeleting || isSaving}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {isArabic ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={isDeleting || isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 disabled:opacity-50"
                  >
                    {(isDeleting || isSaving) ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                    <span>{isArabic ? 'حفظ التغييرات' : 'Save Changes'}</span>
                  </button>
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
      </div>
    </div>
  )
}
