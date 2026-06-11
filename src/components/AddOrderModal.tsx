import React, { useState } from 'react'
import { X } from 'lucide-react'

interface OrderData {
  id: string
  service: string
  customer: string
  region: string
  date: string
  status: string
  price: number
}

interface AddOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (order: OrderData) => void
  isArabic: boolean
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isArabic,
}) => {
  const [service, setService] = useState('')
  const [customer, setCustomer] = useState('')
  const [region, setRegion] = useState('')
  const [status, setStatus] = useState('قيد التنفيذ')
  const [price, setPrice] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!service || !customer || !region || !price) {
      alert(isArabic ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`
    const today = new Date()
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`

    const newOrder = {
      id: orderNumber,
      service,
      customer,
      region,
      date: formattedDate,
      status: status || 'قيد التنفيذ',
      price: Number(price),
    }

    onAdd(newOrder)
    // Reset fields
    setService('')
    setCustomer('')
    setRegion('')
    setStatus('قيد التنفيذ')
    setPrice('')
    onClose()
  }

  // Translating options
  const services = isArabic
    ? ['نقل أثاث', 'سحب سيارة', 'مكافحة حشرات', 'تنظيف منازل', 'نقل بضائع']
    : ['Furniture Moving', 'Car Towing', 'Pest Control', 'Home Cleaning', 'Goods Transport']

  const regions = isArabic
    ? ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة']
    : ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah']

  const statuses = isArabic
    ? [
        { value: 'قيد التنفيذ', label: 'قيد التنفيذ' },
        { value: 'مكتمل', label: 'مكتمل' },
        { value: 'ملغي', label: 'ملغي' },
        { value: 'قيد الانتظار', label: 'قيد الانتظار' },
      ]
    : [
        { value: 'قيد التنفيذ', label: 'In Progress' },
        { value: 'مكتمل', label: 'Completed' },
        { value: 'ملغي', label: 'Cancelled' },
        { value: 'قيد الانتظار', label: 'Pending' },
      ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all transform scale-100"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {isArabic ? 'إضافة طلب جديد' : 'Create New Order'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isArabic ? 'العميل' : 'Customer Name'} *
            </label>
            <input
              type="text"
              required
              placeholder={isArabic ? 'مثال: محمد علي' : 'e.g. John Doe'}
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isArabic ? 'نوع الخدمة' : 'Service Type'} *
            </label>
            <select
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="" className="text-slate-400">
                {isArabic ? 'اختر الخدمة' : 'Select Service'}
              </option>
              {services.map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-slate-800">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Region */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {isArabic ? 'المنطقة' : 'Region'} *
              </label>
              <select
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">
                  {isArabic ? 'اختر المنطقة' : 'Select Region'}
                </option>
                {regions.map((r) => (
                  <option key={r} value={r} className="bg-white dark:bg-slate-800">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                {isArabic ? 'السعر (ر.س)' : 'Price (SAR)'} *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="650"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isArabic ? 'الحالة' : 'Status'}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {statuses.map((st) => (
                <option key={st.value} value={st.value} className="bg-white dark:bg-slate-800">
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
            >
              {isArabic ? 'إضافة الطلب' : 'Add Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
