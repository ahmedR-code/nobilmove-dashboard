import React, { useState } from 'react'
import { X, User, Mail, Lock, RefreshCw } from 'lucide-react'
import api from '../lib/api'
import { toast } from 'sonner'

interface RegisterAdminModalProps {
  isOpen: boolean
  onClose: () => void
  isArabic: boolean
  onSuccess: () => void
}

export const RegisterAdminModal: React.FC<RegisterAdminModalProps> = ({
  isOpen,
  onClose,
  isArabic,
  onSuccess,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error(isArabic ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error(isArabic ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error(isArabic ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/admin/registerAdmin', {
        name,
        email,
        password,
      })

      toast.success(
        isArabic
          ? response.data.message || 'تم تسجيل المشرف الجديد بنجاح'
          : response.data.message || 'New admin registered successfully'
      )
      
      // Reset form
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Error registering admin:', error)
      const errorMsg = error.response?.data?.message || error.message
      toast.error(
        isArabic
          ? `فشل تسجيل المشرف: ${errorMsg}`
          : `Failed to register admin: ${errorMsg}`
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden transform transition-all text-start">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
            {isArabic ? 'تسجيل مشرف جديد' : 'Register New Admin'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isArabic ? 'الاسم بالكامل' : 'Full Name'}
            </label>
            <div className="relative">
              <User className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder={isArabic ? 'أدخل الاسم بالكامل...' : 'Enter full name...'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder={isArabic ? 'example@nobilmove.com' : 'example@nobilmove.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isArabic ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder={isArabic ? 'أدخل كلمة المرور (6 أحرف فأكثر)...' : 'Enter password (6+ chars)...'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            </label>
            <div className="relative">
              <Lock className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder={isArabic ? 'أعد كتابة كلمة المرور...' : 'Retype password...'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-orange-600 disabled:bg-orange-500/60 transition-all shadow-sm shadow-orange-500/15"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{isArabic ? 'جاري الحفظ...' : 'Saving...'}</span>
                </>
              ) : (
                <span>{isArabic ? 'إضافة مشرف' : 'Register Admin'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
