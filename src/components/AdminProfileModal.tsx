import React, { useState, useEffect } from 'react'
import { X, User, Mail, Lock, Shield, KeyRound, RefreshCw } from 'lucide-react'
import api from '../lib/api'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'

interface AdminProfileModalProps {
  isOpen: boolean
  onClose: () => void
  isArabic: boolean
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
  isArabic,
}) => {
  const { admin, updateAdmin } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  // Profile fields state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Fetch admin profile details on open
  useEffect(() => {
    if (isOpen) {
      fetchProfile()
    }
  }, [isOpen])

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true)
      const response = await api.get('/admin/profile')
      const profileData = response.data
      setName(profileData.name || '')
      setEmail(profileData.email || '')
      
      // Update global auth store if details have changed
      if (admin && (admin.name !== profileData.name || admin.email !== profileData.email)) {
        updateAdmin({
          ...admin,
          name: profileData.name,
          email: profileData.email,
        })
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error)
      toast.error(isArabic ? 'فشل في تحميل بيانات الملف الشخصي' : 'Failed to load profile details')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error(isArabic ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    try {
      setSavingProfile(true)
      const response = await api.put('/admin/profile', { name, email })
      const updatedAdmin = response.data.admin || response.data
      
      // Update local state and authStore
      if (admin) {
        updateAdmin({
          ...admin,
          name: updatedAdmin.name || name,
          email: updatedAdmin.email || email,
        })
      }

      toast.success(
        isArabic
          ? response.data.message || 'تم تحديث الملف الشخصي بنجاح'
          : response.data.message || 'Profile updated successfully'
      )
    } catch (error: any) {
      console.error('Error updating profile:', error)
      const errorMsg = error.response?.data?.message || error.message
      toast.error(
        isArabic
          ? `فشل تحديث الملف الشخصي: ${errorMsg}`
          : `Failed to update profile: ${errorMsg}`
      )
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error(isArabic ? 'الرجاء ملء جميع حقول كلمة المرور' : 'Please fill all password fields')
      return
    }

    if (newPassword !== confirmNewPassword) {
      toast.error(isArabic ? 'كلمتا المرور الجديدتان غير متطابقتين' : 'New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error(isArabic ? 'يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل' : 'New password must be at least 6 characters')
      return
    }

    try {
      setChangingPassword(true)
      const response = await api.put('/admin/change-password', {
        currentPassword,
        newPassword,
      })

      toast.success(
        isArabic
          ? response.data.message || 'تم تغيير كلمة المرور بنجاح'
          : response.data.message || 'Password changed successfully'
      )

      // Reset fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (error: any) {
      console.error('Error changing password:', error)
      const errorMsg = error.response?.data?.message || error.message
      toast.error(
        isArabic
          ? `فشل تغيير كلمة المرور: ${errorMsg}`
          : `Failed to change password: ${errorMsg}`
      )
    } finally {
      setChangingPassword(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden transform transition-all text-start flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800/60 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-orange-500" />
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
              {isArabic ? 'إعدادات الملف الشخصي للمشرف' : 'Admin Profile Settings'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-50 dark:border-slate-800/60 flex gap-4 text-xs font-bold bg-slate-50/50 dark:bg-slate-950/20 flex-shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <User size={14} />
            <span>{isArabic ? 'البيانات الأساسية' : 'General Profile'}</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'password'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound size={14} />
            <span>{isArabic ? 'تغيير كلمة المرور' : 'Security / Password'}</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loadingProfile ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="animate-spin mb-4" size={28} />
              <p className="text-sm font-semibold">{isArabic ? 'جاري تحميل بيانات الحساب...' : 'Loading profile data...'}</p>
            </div>
          ) : activeTab === 'profile' ? (
            /* Tab: Profile */
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isArabic ? 'الاسم بالكامل' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={isArabic ? 'أدخل اسمك...' : 'Enter your name...'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={isArabic ? 'yourname@nobilmove.com' : 'yourname@nobilmove.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800/60 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-orange-600 disabled:bg-orange-500/60 transition-all shadow-sm shadow-orange-500/15"
                >
                  {savingProfile ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>{isArabic ? 'جاري الحفظ...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{isArabic ? 'حفظ التغييرات' : 'Save Changes'}</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Tab: Change Password */
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isArabic ? 'كلمة المرور الحالية' : 'Current Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder={isArabic ? 'أدخل كلمة المرور الحالية...' : 'Enter current password...'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isArabic ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder={isArabic ? 'أدخل كلمة المرور الجديدة...' : 'Enter new password...'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {isArabic ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder={isArabic ? 'أعد كتابة كلمة المرور الجديدة...' : 'Retype new password...'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full ps-9 pe-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800/60 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-orange-600 disabled:bg-orange-500/60 transition-all shadow-sm shadow-orange-500/15"
                >
                  {changingPassword ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>{isArabic ? 'جاري التعديل...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <span>{isArabic ? 'تغيير كلمة المرور' : 'Change Password'}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
