import React, { useState, useEffect } from 'react'
import { X, User, Phone, Mail, AlertCircle, RefreshCw, Trash2, Calendar, ShoppingBag, ShieldAlert } from 'lucide-react'
import api from '../lib/api'
import { toast } from 'sonner'

interface CustomerDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string | null
  isArabic: boolean
  onSuccess: () => void
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customerId,
  isArabic,
  onSuccess
}) => {
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isSuspending, setIsSuspending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isOpen && customerId) {
      fetchCustomerDetails()
    } else {
      setCustomer(null)
    }
  }, [isOpen, customerId])

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/customers/${customerId}`)
      setCustomer(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching customer details:', error)
      toast.error(isArabic ? 'فشل في تحميل تفاصيل العميل' : 'Failed to load customer details')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSuspend = async () => {
    if (!customerId) return
    const isCurrentlySuspended = customer?.status === 'suspended'
    const confirmMsg = isCurrentlySuspended
      ? (isArabic ? 'هل تريد بالتأكيد إلغاء إيقاف هذا العميل؟' : 'Are you sure you want to unsuspend this customer?')
      : (isArabic ? 'هل تريد بالتأكيد إيقاف حساب هذا العميل؟' : 'Are you sure you want to suspend this customer account?')

    if (!window.confirm(confirmMsg)) return

    try {
      setIsSuspending(true)
      await api.put(`/admin/customers/${customerId}/suspend`)
      toast.success(
        isCurrentlySuspended
          ? (isArabic ? 'تم تنشيط حساب العميل بنجاح' : 'Customer account activated successfully')
          : (isArabic ? 'تم إيقاف حساب العميل بنجاح' : 'Customer account suspended successfully')
      )
      // Refresh details
      await fetchCustomerDetails()
      onSuccess()
    } catch (error) {
      console.error('Error toggling customer suspension:', error)
      toast.error(isArabic ? 'فشل في تعديل حالة العميل' : 'Failed to modify customer status')
    } finally {
      setIsSuspending(false)
    }
  }

  const handleDelete = async () => {
    if (!customerId) return
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف هذا العميل نهائياً؟' : 'Are you sure you want to permanently delete this customer?')) return

    try {
      setIsDeleting(true)
      await api.delete(`/admin/customers/${customerId}`)
      toast.success(isArabic ? 'تم حذف العميل بنجاح' : 'Customer deleted successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error(isArabic ? 'فشل في حذف العميل' : 'Failed to delete customer')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

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

  const ordersList = customer?.orders || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all transform scale-100 max-h-[90vh] flex flex-col"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {isArabic ? 'تفاصيل حساب العميل' : 'Customer Account Details'}
            </h3>
            {customerId && (
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-500 border border-slate-200 dark:border-slate-700">
                #{customerId}
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
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RefreshCw className="animate-spin mb-4" size={24} />
              <p>{isArabic ? 'جاري التحميل...' : 'Loading details...'}</p>
            </div>
          ) : customer ? (
            <div className="space-y-6">
              
              {/* Profile Card Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-850 dark:to-slate-900 border border-slate-100 dark:border-slate-800/80">
                <div className="relative">
                  <img 
                    src={customer.imageProfile || customer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                    alt={customer.name} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
                  />
                </div>

                <div className="text-center sm:text-start flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">{customer.name}</h4>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      customer.status === 'suspended'
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                        : 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400'
                    }`}>
                      {customer.status === 'suspended' 
                        ? (isArabic ? 'موقوف' : 'Suspended') 
                        : (isArabic ? 'نشط' : 'Active')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">
                    {isArabic ? 'اسم المستخدم' : 'Username'}: <span className="text-slate-600 dark:text-slate-300 font-bold">{customer.userName || customer.username || '-'}</span>
                  </p>
                  <p className="text-xs text-slate-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    <span>{isArabic ? 'تاريخ التسجيل' : 'Registered On'}: {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}</span>
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    {isArabic ? 'بيانات التواصل' : 'Contact Details'}
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                        <Phone size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold">{isArabic ? 'رقم الهاتف' : 'Phone Number'}</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300" dir="ltr">
                          {customer.phoneNumber || '-'}
                        </p>
                      </div>
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                          <Mail size={14} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</p>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suspension block */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <ShieldAlert size={16} className="text-slate-400" />
                    {isArabic ? 'إدارة حالة الحساب' : 'Account Status Controls'}
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      {isArabic 
                        ? 'إيقاف حساب العميل يمنعه من تسجيل الدخول وإنشاء طلبات نقل أثاث أو خدمات أخرى مؤقتاً.' 
                        : 'Suspending this customer prevents them from logging in and creating requests temporarily.'}
                    </p>

                    <button
                      onClick={handleToggleSuspend}
                      disabled={isSuspending || isDeleting}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 ${
                        customer.status === 'suspended'
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/10'
                          : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/10'
                      }`}
                    >
                      {isSuspending ? <RefreshCw className="animate-spin" size={14} /> : <ShieldAlert size={14} />}
                      <span>
                        {customer.status === 'suspended'
                          ? (isArabic ? 'إلغاء الإيقاف / تفعيل الحساب' : 'Unsuspend Customer')
                          : (isArabic ? 'إيقاف مؤقت للحساب' : 'Suspend Account')}
                      </span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Customer Orders History */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-slate-400" />
                  {isArabic ? 'سجل طلبات العميل' : 'Customer Order History'} ({ordersList.length})
                </h4>

                {ordersList.length > 0 ? (
                  <div className="border border-slate-100 dark:border-slate-850 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-xs text-start">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold">
                        <tr>
                          <th className="px-4 py-2 text-start">{isArabic ? 'رقم الطلب' : 'Order ID'}</th>
                          <th className="px-4 py-2 text-start">{isArabic ? 'الخدمة' : 'Service'}</th>
                          <th className="px-4 py-2 text-start">{isArabic ? 'التكلفة' : 'Cost'}</th>
                          <th className="px-4 py-2 text-start">{isArabic ? 'الحالة' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                        {ordersList.map((o: any) => (
                          <tr key={o._id || o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-2 font-semibold">#{o._id || o.id}</td>
                            <td className="px-4 py-2">{translateService(o.service)}</td>
                            <td className="px-4 py-2 font-bold">{isArabic ? 'ر.س' : 'SAR'} {o.totalPrice || o.price || 0}</td>
                            <td className="px-4 py-2">{translateStatus(o.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                    <AlertCircle className="mx-auto mb-2" size={20} />
                    <p className="text-xs font-medium">{isArabic ? 'لا توجد طلبات سابقة لهذا العميل' : 'No previous orders found for this customer'}</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <AlertCircle className="mb-4" size={24} />
              <p>{isArabic ? 'العميل غير موجود' : 'Customer not found'}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
          <button 
            onClick={handleDelete}
            disabled={isSuspending || isDeleting}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
            <span>{isArabic ? 'حذف الحساب نهائياً' : 'Delete Account'}</span>
          </button>

          <button
            onClick={onClose}
            disabled={isSuspending || isDeleting}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
