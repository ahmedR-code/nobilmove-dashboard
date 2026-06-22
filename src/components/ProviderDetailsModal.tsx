import React, { useState, useEffect } from 'react'
import { X, MapPin, Phone, Mail, Award, CheckCircle, AlertCircle, RefreshCw, Trash2, Shield, Eye, Download, Image as ImageIcon, Settings } from 'lucide-react'
import api from '../lib/api'
import { toast } from 'sonner'

interface ProviderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  providerId: string | null
  isArabic: boolean
  onSuccess: () => void
}

export const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({
  isOpen,
  onClose,
  providerId,
  isArabic,
  onSuccess
}) => {
  const [provider, setProvider] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (isOpen && providerId) {
      fetchProviderDetails()
    } else {
      setProvider(null)
      setStatus('')
    }
  }, [isOpen, providerId])

  const fetchProviderDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/providers/${providerId}`)
      const providerData = response.data.data || response.data
      setProvider(providerData)
      setStatus(providerData.status || '')
    } catch (error) {
      console.error('Error fetching provider details:', error)
      toast.error(isArabic ? 'فشل في تحميل تفاصيل مزود الخدمة' : 'Failed to load provider details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!providerId) return
    try {
      setIsSaving(true)
      await api.put(`/admin/providers/${providerId}/status`, { status })
      toast.success(isArabic ? 'تم تحديث حالة مزود الخدمة بنجاح' : 'Provider status updated successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating provider status:', error)
      toast.error(isArabic ? 'فشل في تحديث حالة مزود الخدمة' : 'Failed to update provider status')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!providerId) return
    if (!window.confirm(isArabic ? 'هل أنت متأكد من حذف مزود الخدمة هذا نهائياً؟' : 'Are you sure you want to permanently delete this provider?')) return

    try {
      setIsDeleting(true)
      await api.delete(`/admin/providers/${providerId}`)
      toast.success(isArabic ? 'تم حذف مزود الخدمة بنجاح' : 'Provider deleted successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting provider:', error)
      toast.error(isArabic ? 'فشل في حذف مزود الخدمة' : 'Failed to delete provider')
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

  const getStatusLabel = (val: string) => {
    if (!val) return ''
    const norm = val.toLowerCase()
    if (norm === 'approved' || norm === 'active' || norm === 'مقبول' || norm === 'نشط') {
      return isArabic ? 'مقبول / نشط' : 'Approved / Active'
    }
    if (norm === 'pending' || norm === 'قيد الانتظار' || norm === 'قيد المراجعة') {
      return isArabic ? 'قيد المراجعة' : 'Pending Review'
    }
    if (norm === 'suspended' || norm === 'موقوف') {
      return isArabic ? 'موقوف' : 'Suspended'
    }
    if (norm === 'rejected' || norm === 'مرفوض') {
      return isArabic ? 'مرفوض' : 'Rejected'
    }
    return val
  }

  const renderDocumentLink = (titleAr: string, titleEn: string, url: string) => {
    if (!url) return null
    return (
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <ImageIcon size={18} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {isArabic ? titleAr : titleEn}
          </span>
        </div>
        <div className="flex gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-orange-500 hover:border-orange-500 transition-all"
            title={isArabic ? 'عرض الملف' : 'View File'}
          >
            <Eye size={14} />
          </a>
        </div>
      </div>
    )
  }

  const renderDocumentsList = (titleAr: string, titleEn: string, urls: string[] | string) => {
    const list = Array.isArray(urls) ? urls : (urls ? [urls] : [])
    if (list.length === 0) return null

    return (
      <div className="space-y-2">
        <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {isArabic ? titleAr : titleEn} ({list.length})
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {list.map((url, index) => (
            <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 truncate">
                <ImageIcon size={16} className="text-slate-400 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                  {isArabic ? `ملف #${index + 1}` : `File #${index + 1}`}
                </span>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 hover:text-orange-500 hover:border-orange-500 transition-all flex-shrink-0"
              >
                <Eye size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    )
  }

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
              {isArabic ? 'تفاصيل مزود الخدمة' : 'Service Provider Details'}
            </h3>
            {providerId && (
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-500 border border-slate-200 dark:border-slate-700">
                #{providerId}
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
          ) : provider ? (
            <div className="space-y-6">
              
              {/* Profile Card Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-850 dark:to-slate-900 border border-slate-100 dark:border-slate-800/80">
                <div className="relative">
                  <img
                    src={provider.imageProfile || provider.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                    alt={provider.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
                  />
                  {provider.status === 'approved' && (
                    <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-900">
                      <Award size={14} />
                    </span>
                  )}
                </div>

                <div className="text-center sm:text-start flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">{provider.name}</h4>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                      provider.status === 'approved' || provider.status === 'active'
                        ? 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400'
                        : provider.status === 'pending'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                    }`}>
                      {getStatusLabel(provider.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {isArabic ? 'الخدمة' : 'Service'}: <span className="text-orange-500 font-bold">{translateService(provider.serviceType)}</span>
                  </p>
                  <p className="text-xs text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{provider.city || provider.region || '-'}</span>
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Provider Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Shield size={16} className="text-slate-400" />
                    {isArabic ? 'معلومات الحساب والتواصل' : 'Account & Contact Details'}
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                        <Phone size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold">{isArabic ? 'رقم الهاتف' : 'Phone Number'}</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300" dir="ltr">
                          {provider.phoneNumber || '-'}
                        </p>
                      </div>
                    </div>
                    {provider.email && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                          <Mail size={14} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</p>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {provider.email}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400">
                        <CheckCircle size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold">{isArabic ? 'عدد الرحلات / الطلبات' : 'Total Trips'}</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {provider.trips ?? provider.orders?.length ?? 0} {isArabic ? 'طلب' : 'orders'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Admin Actions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Settings size={16} className="text-slate-400" />
                    {isArabic ? 'الإجراءات الإدارية' : 'Administrative Actions'}
                  </h4>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 font-bold mb-2">
                        {isArabic ? 'حالة الاعتماد' : 'Verification Status'}
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="pending">{isArabic ? 'قيد المراجعة (Pending)' : 'Pending Review'}</option>
                        <option value="approved">{isArabic ? 'مقبول / نشط (Approved)' : 'Approved'}</option>
                        <option value="suspended">{isArabic ? 'موقوف (Suspended)' : 'Suspended'}</option>
                        <option value="rejected">{isArabic ? 'مرفوض (Rejected)' : 'Rejected'}</option>
                      </select>
                    </div>

                    <button
                      onClick={handleUpdateStatus}
                      disabled={isSaving || isDeleting}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                      <span>{isArabic ? 'حفظ تعديل الحالة' : 'Save Status Change'}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Documents & Files Section */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Download size={16} className="text-slate-400" />
                  {isArabic ? 'الوثائق والمستندات المرفقة' : 'Verification Documents'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDocumentLink('الهوية الوطنية / الإقامة', 'National ID / Residency', provider.nationalId)}
                  {renderDocumentLink('السجل التجاري', 'Commercial Register', provider.commercialRegister)}
                </div>

                <div className="space-y-4 pt-2">
                  {renderDocumentsList('صور المركبة', 'Vehicle Photos', provider.vehiclePhotos)}
                  {renderDocumentsList('الشهادات والتراخيص', 'Certificates & Licenses', provider.certificates)}
                </div>

                {!provider.nationalId && !provider.commercialRegister && (!provider.vehiclePhotos || provider.vehiclePhotos.length === 0) && (!provider.certificates || provider.certificates.length === 0) && (
                  <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                    <AlertCircle className="mx-auto mb-2" size={20} />
                    <p className="text-xs font-medium">{isArabic ? 'لا توجد مستندات مرفقة لهذا المزود' : 'No document attachments uploaded for this provider'}</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <AlertCircle className="mb-4" size={24} />
              <p>{isArabic ? 'مقدم الخدمة غير موجود' : 'Provider not found'}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={isSaving || isDeleting}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
            <span>{isArabic ? 'حذف الحساب' : 'Delete Provider'}</span>
          </button>

          <button
            onClick={onClose}
            disabled={isSaving || isDeleting}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
