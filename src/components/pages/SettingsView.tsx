import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Settings, Edit2, DollarSign, Percent, Box, Truck, Shield, HelpCircle, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import api from '../../lib/api'
import { EditPricingModal } from '../EditPricingModal'
import type { PricingData } from '../EditPricingModal'

const SERVICES_LIST = [
  { key: 'نقل أثاث', labelAr: 'نقل أثاث', labelEn: 'Furniture Moving', icon: Box, color: 'from-orange-500/10 to-orange-600/10 text-orange-500 border-orange-500/20' },
  { key: 'سحب سيارة', labelAr: 'سحب سيارة', labelEn: 'Car Towing', icon: Truck, color: 'from-blue-500/10 to-blue-600/10 text-blue-500 border-blue-500/20' },
  { key: 'مكافحة حشرات', labelAr: 'مكافحة حشرات', labelEn: 'Pest Control', icon: Shield, color: 'from-green-500/10 to-green-600/10 text-green-500 border-green-500/20' },
  { key: 'تنظيف منازل', labelAr: 'تنظيف منازل', labelEn: 'Home Cleaning', icon: HelpCircle, color: 'from-purple-500/10 to-purple-600/10 text-purple-500 border-purple-500/20' },
  { key: 'نقل بضائع', labelAr: 'نقل بضائع', labelEn: 'Goods Transport', icon: ShoppingBag, color: 'from-cyan-500/10 to-cyan-600/10 text-cyan-500 border-cyan-500/20' },
]

export const SettingsView: React.FC = () => {
  const { isArabic } = useOutletContext<{ isArabic: boolean }>()
  const [configurations, setConfigurations] = useState<PricingData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPricing, setSelectedPricing] = useState<PricingData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchPricingSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/settings/pricing')
      const responseData = response.data

      // Check if data is array or wrapped
      const backendConfigs: PricingData[] = Array.isArray(responseData)
        ? responseData
        : (responseData?.data || [])

      // Merge backend configurations with standard service list to guarantee all 5 are shown
      const merged: PricingData[] = SERVICES_LIST.map((srv) => {
        const match = backendConfigs.find(
          (c) => c.serviceType === srv.key || c.serviceType?.toLowerCase() === srv.key.toLowerCase()
        )
        return {
          serviceType: srv.key,
          pricePerKilometer: match ? match.pricePerKilometer : 0,
          pricePerSquareMeter: match ? match.pricePerSquareMeter : 0,
          companyCommissionPercentage: match ? match.companyCommissionPercentage : 0,
        }
      })

      setConfigurations(merged)
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error(isArabic ? 'فشل تحميل إعدادات الأسعار' : 'Failed to load pricing configurations')
      
      // Load fallback defaults in case API is empty or errors out
      const defaults: PricingData[] = SERVICES_LIST.map((srv) => ({
        serviceType: srv.key,
        pricePerKilometer: 0,
        pricePerSquareMeter: 0,
        companyCommissionPercentage: 0,
      }))
      setConfigurations(defaults)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPricingSettings()
  }, [])

  const handleEditClick = (pricing: PricingData) => {
    setSelectedPricing(pricing)
    setIsModalOpen(true)
  }

  const handleSaveSuccess = () => {
    fetchPricingSettings()
  }

  return (
    <div className="space-y-6 text-start">
      {/* Intro info bar */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl mt-0.5">
            <Settings size={22} className="animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-850 dark:text-slate-100">
              {isArabic ? 'إعدادات أسعار الخدمات' : 'Service Pricing Configurations'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              {isArabic 
                ? 'تتيح لك هذه الصفحة ضبط تسعير كل خدمة تقدم عبر التطبيق بالاعتماد على أسعار الكيلومترات والمساحات المربعة، بالإضافة لنسبة عمولة الشركة المقتطعة.' 
                : 'This panel allows you to customize the billing rates for each platform service based on kilometers, square meters, and company commission percentages.'}
            </p>
          </div>
        </div>
      </section>

      {/* Grid of pricing cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 h-64 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm animate-pulse p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configurations.map((pricing) => {
            const staticInfo = SERVICES_LIST.find((s) => s.key === pricing.serviceType) || SERVICES_LIST[0]
            const Icon = staticInfo.icon
            const isConfigured = pricing.pricePerKilometer > 0 || pricing.pricePerSquareMeter > 0 || pricing.companyCommissionPercentage > 0

            return (
              <div
                key={pricing.serviceType}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Upper Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-gradient-to-br ${staticInfo.color} border rounded-xl shadow-sm flex items-center justify-center`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                          {isArabic ? staticInfo.labelAr : staticInfo.labelEn}
                        </h4>
                        <span className="text-xs text-slate-400 font-bold block uppercase mt-0.5 tracking-wider">
                          {isArabic ? 'نوع الخدمة' : 'Service Type'}
                        </span>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      isConfigured
                        ? 'bg-green-500/10 text-green-600 dark:text-green-450 border border-green-500/20'
                        : 'bg-orange-500/10 text-orange-600 dark:text-orange-450 border border-orange-500/20'
                    }`}>
                      {isConfigured
                        ? (isArabic ? 'مفعلة' : 'Configured')
                        : (isArabic ? 'قيمة افتراضية' : 'Default')}
                    </span>
                  </div>

                  {/* Pricing metrics divider */}
                  <div className="h-px bg-slate-100 dark:bg-slate-800/60 my-5"></div>

                  {/* Attributes list */}
                  <div className="space-y-3.5">
                    {/* Price per Kilometer */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2 text-slate-400">
                        <DollarSign size={14} className="text-slate-400" />
                        <span>{isArabic ? 'سعر الكيلومتر' : 'Price per Kilometer'}</span>
                      </div>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">
                        {pricing.pricePerKilometer.toFixed(2)} {isArabic ? 'ر.س' : 'SAR'}
                      </span>
                    </div>

                    {/* Price per Square Meter */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2 text-slate-400">
                        <DollarSign size={14} className="text-slate-400" />
                        <span>{isArabic ? 'سعر المتر المربع' : 'Price per Sq. Meter'}</span>
                      </div>
                      <span className="text-slate-800 dark:text-slate-200 font-bold">
                        {pricing.pricePerSquareMeter.toFixed(2)} {isArabic ? 'ر.س' : 'SAR'}
                      </span>
                    </div>

                    {/* Company commission percentage */}
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Percent size={14} className="text-slate-400" />
                        <span>{isArabic ? 'نسبة عمولة الشركة' : 'Company Commission'}</span>
                      </div>
                      <span className="text-orange-500 font-extrabold">
                        {pricing.companyCommissionPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end">
                  <button
                    onClick={() => handleEditClick(pricing)}
                    className="flex items-center gap-1.5 text-xs font-extrabold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-1 px-3.5 rounded-lg hover:bg-orange-500/5 group/btn"
                  >
                    <Edit2 size={13} className="transition-transform group-hover/btn:scale-110" />
                    <span>{isArabic ? 'تعديل الإعدادات' : 'Edit Configuration'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* Edit modal */}
      <EditPricingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPricing(null)
        }}
        pricing={selectedPricing}
        onSaveSuccess={handleSaveSuccess}
        isArabic={isArabic}
      />
    </div>
  )
}
