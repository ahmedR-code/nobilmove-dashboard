import React, { useState, useEffect } from 'react'
import { X, DollarSign, Percent, Settings, Check } from 'lucide-react'
import { toast } from 'sonner'
import api from '../lib/api'

export interface PricingData {
  serviceType: string
  pricePerKilometer: number
  pricePerSquareMeter: number
  companyCommissionPercentage: number
}

interface EditPricingModalProps {
  isOpen: boolean
  onClose: () => void
  pricing: PricingData | null
  onSaveSuccess: () => void
  isArabic: boolean
}

export const EditPricingModal: React.FC<EditPricingModalProps> = ({
  isOpen,
  onClose,
  pricing,
  onSaveSuccess,
  isArabic,
}) => {
  const [pricePerKm, setPricePerKm] = useState('')
  const [pricePerSqM, setPricePerSqM] = useState('')
  const [commission, setCommission] = useState('')
  const [loading, setLoading] = useState(false)

  // Initialize values when pricing changes
  useEffect(() => {
    if (pricing) {
      setPricePerKm(pricing.pricePerKilometer.toString())
      setPricePerSqM(pricing.pricePerSquareMeter.toString())
      setCommission(pricing.companyCommissionPercentage.toString())
    }
  }, [pricing, isOpen])

  if (!isOpen || !pricing) return null

  // Translate service name for display
  const translateService = (val: string) => {
    const mapping: Record<string, string> = {
      'نقل أثاث': 'Furniture Moving',
      'سحب سيارة': 'Car Towing',
      'مكافحة حشرات': 'Pest Control',
      'تنظيف منازل': 'Home Cleaning',
      'نقل بضائع': 'Goods Transport',
    }
    return isArabic ? val : (mapping[val] || val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const kmPrice = Number(pricePerKm)
    const sqMPrice = Number(pricePerSqM)
    const commPct = Number(commission)

    // Form validation
    if (isNaN(kmPrice) || kmPrice < 0) {
      toast.error(isArabic ? 'سعر الكيلومتر يجب أن يكون رقم إيجابي' : 'Price per kilometer must be a positive number')
      return
    }
    if (isNaN(sqMPrice) || sqMPrice < 0) {
      toast.error(isArabic ? 'سعر المتر المربع يجب أن يكون رقم إيجابي' : 'Price per square meter must be a positive number')
      return
    }
    if (isNaN(commPct) || commPct < 0 || commPct > 100) {
      toast.error(isArabic ? 'عمولة الشركة يجب أن تكون بين 0 و 100' : 'Company commission must be between 0 and 100')
      return
    }

    setLoading(false)
    try {
      setLoading(true)
      const response = await api.put('/admin/settings/pricing', {
        serviceType: pricing.serviceType,
        pricePerKilometer: kmPrice,
        pricePerSquareMeter: sqMPrice,
        companyCommissionPercentage: commPct,
      })

      if (response.status === 200) {
        toast.success(isArabic ? 'تم تحديث إعدادات التسعير بنجاح' : 'Pricing configuration updated successfully')
        onSaveSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Error updating pricing settings:', error)
      toast.error(isArabic ? 'فشل تحديث إعدادات التسعير' : 'Failed to update pricing configuration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all transform scale-100"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
              <Settings size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {isArabic ? 'تعديل أسعار الخدمة' : 'Edit Service Pricing'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Service Name Info */}
          <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/50 text-start">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              {isArabic ? 'الخدمة المختارة' : 'Selected Service'}
            </span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1 block">
              {translateService(pricing.serviceType)}
            </span>
          </div>

          {/* Price per Kilometer */}
          <div className="text-start">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {isArabic ? 'سعر الكيلومتر (ر.س)' : 'Price per Kilometer (SAR)'}
            </label>
            <div className="relative group">
              <div className="absolute start-3 top-2.5 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <DollarSign size={16} />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={pricePerKm}
                onChange={(e) => setPricePerKm(e.target.value)}
                className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Price per Square Meter */}
          <div className="text-start">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {isArabic ? 'سعر المتر المربع (ر.س)' : 'Price per Square Meter (SAR)'}
            </label>
            <div className="relative group">
              <div className="absolute start-3 top-2.5 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <DollarSign size={16} />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={pricePerSqM}
                onChange={(e) => setPricePerSqM(e.target.value)}
                className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Commission percentage */}
          <div className="text-start">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              {isArabic ? 'عمولة الشركة (%)' : 'Company Commission (%)'}
            </label>
            <div className="relative group">
              <div className="absolute start-3 top-2.5 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <Percent size={16} />
              </div>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                required
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-semibold"
                placeholder="15"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-slate-550 dark:text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-xl transition-colors border border-transparent disabled:opacity-50"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Check size={14} />
              )}
              <span>{isArabic ? 'حفظ التعديلات' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
