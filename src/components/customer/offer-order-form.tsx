'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

type TimeOption = 'any' | '8-12' | '12-16' | '16-20'
type WorkLocationOption = 'customer_home' | 'specialist_pickup' | 'customer_dropoff'

interface OfferOrderFormProps {
  specialistId: string
  mainCategoryName?: string | null
  onSuccess?: () => void
}

export function OfferOrderForm({ specialistId, mainCategoryName, onSuccess }: OfferOrderFormProps) {
  const { isSignedIn } = useAuth()
  
  // Order details
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [confidentialData, setConfidentialData] = useState('')
  const [note, setNote] = useState('')
  const [files, setFiles] = useState<File[]>([])

  // Address
  const [city, setCity] = useState('Kyiv')
  const [district, setDistrict] = useState('Kyiv')
  const [street, setStreet] = useState('')
  const [house, setHouse] = useState('')

  // Schedule
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [timeOption, setTimeOption] = useState<TimeOption>('any')

  // Work details
  const [workLocation, setWorkLocation] = useState<WorkLocationOption>('customer_home')
  const [workType, setWorkType] = useState<string>('Problems with enabling / disabling')

  // Contacts
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cities = ['Kyiv']
  const districts = ['Kyiv', 'Shevchenkivskyi', 'Pecherskyi', 'Solomianskyi']

  const locationString = useMemo(() => {
    const parts = [city, district, street, house].filter(Boolean)
    return parts.join(', ')
  }, [city, district, street, house])

  const dayOfWeek = useMemo(() => {
    if (!selectedDate) return ''
    const d = new Date(selectedDate)
    return d.toLocaleDateString('en-US', { weekday: 'long' })
  }, [selectedDate])

  const handleFileSelect = () => fileInputRef.current?.click()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selected])
  }
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index))

  // Helper to get file icon based on file type
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    // PDF icon
    if (ext === 'pdf') {
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0H10C7.2 0 5.005 2.25 5.005 5L5 75C5 77.75 7.15 80 9.95 80H70C72.8 80 75 77.75 75 75V25L50 0Z" fill="#5A9A9A"/>
          <path d="M50 0V25H75L50 0Z" fill="#4A8080"/>
          <text x="40" y="55" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">PDF</text>
        </svg>
      )
    }
    
    // Image icon
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0H10C7.2 0 5.005 2.25 5.005 5L5 75C5 77.75 7.15 80 9.95 80H70C72.8 80 75 77.75 75 75V25L50 0Z" fill="#5A9A9A"/>
          <path d="M50 0V25H75L50 0Z" fill="#4A8080"/>
          <circle cx="32" cy="38" r="4" fill="white"/>
          <path d="M22 55L30 45L38 53L48 40L58 55H22Z" fill="white"/>
        </svg>
      )
    }
    
    // Default document icon
    return (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 0H10C7.2 0 5.005 2.25 5.005 5L5 75C5 77.75 7.15 80 9.95 80H70C72.8 80 75 77.75 75 75V25L50 0Z" fill="#5A9A9A"/>
        <path d="M50 0V25H75L50 0Z" fill="#4A8080"/>
        <path d="M20 35H60M20 45H60M20 55H45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    )
  }

  // Для авторизованих користувачів галочка не потрібна
  const canSubmit = isSignedIn 
    ? title.trim() && description.trim() && !isSubmitting
    : title.trim() && description.trim() && agreeTerms && !isSubmitting

  const submit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    try {
      const form = new FormData()
      // Map to API fields
      form.append('task', title)
      // Merge description + note
      const fullDesc = note ? `${description}\n\nNote: ${note}` : description
      form.append('description', fullDesc)
      form.append('confidentialData', confidentialData)
      form.append('location', locationString)
      form.append('workLocation', workLocation)
      form.append('workType', workType)
      form.append('timePreference', timeOption)
      if (selectedDate) form.append('selectedDate', selectedDate)
      if (dayOfWeek) form.append('selectedDay', dayOfWeek)
      if (contactName) form.append('contactName', contactName)
      if (contactEmail) form.append('contactEmail', contactEmail)
      if (contactPhone) form.append('contactPhone', contactPhone)
      if (specialistId) form.append('specialistId', specialistId)
      if (mainCategoryName) form.append('category', mainCategoryName)

      files.forEach((file, i) => form.append(`file_${i}`, file))

      const res = await fetch('/api/orders', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || `Failed to create order (${res.status})`)
      }

      onSuccess?.()
    } catch (e) {
      console.error('Offer submit failed', e)
      alert(e instanceof Error ? e.message : 'Failed to create order')
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Inline calendar helpers (always open) ---
  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [currentMonth])

  const startOfMonth = useMemo(() => {
    const d = new Date(currentMonth)
    d.setDate(1)
    return d
  }, [currentMonth])

  const daysGrid = useMemo(() => {
    // Build a Monday-first calendar grid with 6 rows x 7 cols
    const result: { date: Date; inMonth: boolean }[] = []
    const first = new Date(startOfMonth)
    // JS: 0 Sun ... 6 Sat; we want Monday=1..Sunday=0 -> compute shift
    let weekday = first.getDay() // 0..6
    const mondayIndex = (weekday + 6) % 7 // 0..6 where Monday=0
    const gridStart = new Date(first)
    gridStart.setDate(first.getDate() - mondayIndex)

    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      result.push({
        date: d,
        inMonth: d.getMonth() === currentMonth.getMonth(),
      })
    }
    return result
  }, [startOfMonth, currentMonth])

  const isSelected = (d: Date) => {
    if (!selectedDate) return false
    const ds = new Date(selectedDate)
    return d.getFullYear() === ds.getFullYear() && d.getMonth() === ds.getMonth() && d.getDate() === ds.getDate()
  }

  const setPrevMonth = () => {
    const m = new Date(currentMonth)
    m.setMonth(m.getMonth() - 1)
    setCurrentMonth(m)
  }
  const setNextMonth = () => {
    const m = new Date(currentMonth)
    m.setMonth(m.getMonth() + 1)
    setCurrentMonth(m)
  }

  return (
    <section className="w-full bg-white rounded-2xl p-9 mb-12">
      {/* Order details */}
      <div className="mb-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-[24px] font-bold text-[#282a35]">Order details</h3>
          <div className="w-full h-px bg-[#282a35]/20" />
        </div>

  <div className="mt-6 flex flex-col gap-6 max-w-[855px]">
          {/* What needs to be done */}
          <div className="flex items-center gap-6">
            <div className="w-[243px] text-[20px] text-[#282a35]">What needs to be done</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="For example: Electrical installation"
              className="flex-1 h-14 rounded-full border border-[#d8d6d6] px-6"
            />
          </div>

          {/* Describe order */}
          <div className="flex items-start gap-6">
            <div className="w-[243px] text-[20px] text-[#282a35] leading-[140%]">Describe your order in detail</div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="For example: Electrical installation"
              className="flex-1 min-h-[120px] rounded-2xl border border-[#d8d6d6] px-6 py-4"
            />
          </div>

          {/* Confidential data */}
          <div className="flex items-start gap-7">
            <div className="w-[239px]">
              <div className="text-[20px] text-[#282a35]">Confidential data</div>
              <div className="text-xs text-[#646464] mt-1">Only the selected specialist will see this data</div>
            </div>
            <Textarea
              value={confidentialData}
              onChange={(e) => setConfidentialData(e.target.value)}
              className="flex-1 min-h-[120px] rounded-2xl border border-[#d8d6d6] px-6 py-4"
            />
          </div>

          {/* Files */}
          <div className="flex items-start gap-7">
            <div className="w-[239px] text-[20px] text-[#282a35]">Add files</div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={handleFileSelect}>Add</Button>
              </div>
              {files.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 relative group">
                      {/* File icon */}
                      <div className="relative">
                        {getFileIcon(file.name)}
                        {/* Remove button on hover */}
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold hover:bg-red-600"
                          onClick={() => removeFile(idx)}
                          title="Remove file"
                        >
                          ×
                        </button>
                      </div>
                      {/* File name */}
                      <span className="text-xs text-[#282a35] max-w-[80px] truncate text-center" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="mb-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-[24px] font-bold text-[#282a35]">Order fulfillment address</h3>
          <div className="w-full h-px bg-[#282a35]/20" />
        </div>

        <div className="mt-6 max-w-[810px] bg-white rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-[20px] text-[#282a35]">City</div>
            <Input 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              placeholder="Kyiv"
              className="h-14 rounded-full border border-[#d8d6d6] px-6" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[20px] text-[#282a35]">District</div>
            <Input 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)} 
              placeholder="Kyiv"
              className="h-14 rounded-full border border-[#d8d6d6] px-6" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[20px] text-[#282a35]">Street</div>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} className="h-14 rounded-full border border-[#d8d6d6] px-6" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[20px] text-[#282a35]">House</div>
            <Input value={house} onChange={(e) => setHouse(e.target.value)} className="h-14 rounded-full border border-[#d8d6d6] px-6" />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-[24px] font-bold text-[#282a35]">Schedule</h3>
          <div className="w-full h-px bg-[#282a35]/20" />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1109px]">
          {/* Inline calendar in white card */}
          <div className="bg-white rounded-2xl shadow-md p-6 w-[308px]">
            <div className="flex items-center justify-between px-1">
              <button type="button" aria-label="Previous month" onClick={setPrevMonth} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted/40">
                <span className="rotate-180 text-[#a3a3a3]">›</span>
              </button>
              <div className="text-[16px] font-medium text-[#282a35] capitalize">{monthLabel}</div>
              <button type="button" aria-label="Next month" onClick={setNextMonth} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted/40">
                <span className="text-[#a3a3a3]">›</span>
              </button>
            </div>
            <div className="h-px bg-[#e6e6e6] mt-4 mb-3 mx-auto w-[251px]" />
            <div className="grid grid-cols-7 gap-y-2 text-[10px] text-[#646464] px-4">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-4 px-4 mt-2">
              {daysGrid.map(({ date, inMonth }, idx) => {
                const selected = isSelected(date)
                const label = date.getDate()
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const y = date.getFullYear()
                      const m = (date.getMonth() + 1).toString().padStart(2, '0')
                      const dd = date.getDate().toString().padStart(2, '0')
                      setSelectedDate(`${y}-${m}-${dd}`)
                      setCurrentMonth(new Date(y, date.getMonth(), 1))
                    }}
                    className={
                      `mx-auto h-6 w-6 rounded-full text-[14px] leading-6 text-center ` +
                      (selected ? 'bg-[#34979a] text-white' : inMonth ? 'text-[#282a35]' : 'text-[#a3a3a3]')
                    }
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-[20px] text-[#282a35]">When is it necessary to fulfill the order?</div>
            <div className="flex flex-col gap-3">
              <label className="inline-flex items-center gap-2">
                <input className="accent-[#ffa657]" type="radio" checked={timeOption==='any'} onChange={() => setTimeOption('any')} />
                <span className="text-sm text-[#282a35]">At any time</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input className="accent-[#ffa657]" type="radio" checked={timeOption==='8-12'} onChange={() => setTimeOption('8-12')} />
                <span className="text-sm text-[#282a35]">from 8:00 a.m. to 12:00 p.m.</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input className="accent-[#ffa657]" type="radio" checked={timeOption==='12-16'} onChange={() => setTimeOption('12-16')} />
                <span className="text-sm text-[#282a35]">from 12:00 p.m. to 4:00 p.m.</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input className="accent-[#ffa657]" type="radio" checked={timeOption==='16-20'} onChange={() => setTimeOption('16-20')} />
                <span className="text-sm text-[#282a35]">from 4:00 p.m. to 8:00 p.m.</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Work details */}
      <div className="mb-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-[24px] font-bold text-[#282a35]">Order details</h3>
          <div className="w-full h-px bg-[#282a35]/20" />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[788px]">
          <div className="flex flex-col gap-4">
            <div className="text-[20px] text-[#282a35]">Where to do the work</div>
            <div className="flex flex-col gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={workLocation==='customer_home'} onChange={() => setWorkLocation('customer_home')} />
                <span className="text-sm text-[#282a35]">At the customer's home</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={workLocation==='specialist_pickup'} onChange={() => setWorkLocation('specialist_pickup')} />
                <span className="text-sm text-[#282a35]">A specialist will take it for repair</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" checked={workLocation==='customer_dropoff'} onChange={() => setWorkLocation('customer_dropoff')} />
                <span className="text-sm text-[#282a35]">The customer will take it for repair</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-[20px] text-[#282a35]">Types of work</div>
            <div className="flex flex-col gap-3">
              {[
                'Problems with enabling / disabling',
                'Diagnostics',
                'Installation',
                'Consultation',
              ].map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input type="radio" checked={workType===opt} onChange={() => setWorkType(opt)} />
                  <span className="text-sm text-[#282a35]">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mb-8 max-w-[739px]">
        <div className="flex flex-col gap-2">
          <div className="text-[20px] text-[#282a35]">Add a note</div>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[150px] rounded-2xl border border-[#d8d6d6] px-6 py-4" />
        </div>
        <div className="mt-6">
          <Button disabled={!canSubmit} onClick={submit} className="bg-[#55c4c8] text-[#282a35] rounded-full px-9 py-4 disabled:opacity-50">place an order</Button>
        </div>
      </div>

      {/* Contact details */}
      <div className="mt-10">
        <div className="flex flex-col gap-3">
          <h3 className="text-[24px] font-medium text-[#282a35]">Contact details</h3>
          <div className="w-full h-px bg-[#282a35]/20" />
        </div>

        <div className="mt-6 max-w-[1109px]">
          {!isSignedIn ? (
            <>
              {/* Login options for unauthenticated users */}
              <div className="flex gap-9 mb-9">
                {/* Already registered */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-medium text-[#282a35]">Already registered?</h3>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/auth/sign-in'}
                    className="h-[51px] w-[303px] rounded-full border-2 border-[#55c4c8] bg-white px-9 py-3 text-center text-base font-normal text-[#282a35] hover:bg-gray-50"
                  >
                    log in
                  </button>
                </div>

                {/* Or log in with Google */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-medium text-[#282a35]">Or log in with</h3>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/auth/sign-in'}
                    className="flex h-[51px] w-[303px] items-center justify-center gap-2.5 rounded-full border-2 border-[#4285f4] bg-white px-6 py-3 text-base font-normal text-[#282a35] hover:bg-gray-50"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                </div>
              </div>

              {/* Guest form */}
              <div className="bg-[#ffa657]/60 rounded-2xl px-8 py-9">
                <div className="text-xl font-medium text-[#282a35] mb-6">Or fill in the form and get in touch with the executor</div>
                <div className="flex flex-wrap items-end gap-3">
                  {/* Name input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-base text-[#282a35]">Name</label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Kiyv"
                      className="h-14 w-[283px] rounded-full bg-white px-6 py-4 text-base text-[#646464] placeholder:text-[#646464] border-0"
                    />
                  </div>

                  {/* Email input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-base text-[#282a35]">Email</label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Kiyv"
                      className="h-14 w-[283px] rounded-full bg-white px-6 py-4 text-base text-[#646464] placeholder:text-[#646464] border-0"
                    />
                  </div>

                  {/* Phone number input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-base text-[#282a35]">Phone number</label>
                    <Input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Kiyv"
                      className="h-14 w-[415px] rounded-full bg-white px-6 py-4 text-base text-[#646464] placeholder:text-[#646464] border-0"
                    />
                  </div>

                  {/* Checkbox and button */}
                  <div className="flex flex-col gap-3 items-start">
                    <label className="flex items-center gap-2">
                      <Checkbox id="terms-guest" checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(!!v)} className="data-[state=checked]:bg-[#55c4c8]" />
                      <span className="text-sm text-[#282a35]">
                        I agree to the <span className="underline">terms</span> of service
                      </span>
                    </label>
                    
                    <Button
                      disabled={!canSubmit}
                      onClick={submit}
                      className="h-[55px] w-[283px] rounded-full bg-[#ffa657] px-9 py-[18px] text-center text-base font-medium text-[#282a35] hover:bg-[#ff9547] disabled:opacity-50"
                    >
                      publish
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Authenticated user form */
            <div className="bg-[#ffa657]/60 rounded-2xl p-6 md:p-8">
              <div className="text-[20px] font-medium text-[#282a35] mb-6">Or fill in the form and get in touch with the executor</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                {/* Left column: inputs on white pills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="text-[16px] text-[#282a35]">Name</div>
                    <Input value={contactName} onChange={(e) => setContactName(e.target.value)} className="h-14 rounded-full bg-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-[16px] text-[#282a35]">Email</div>
                    <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="h-14 rounded-full bg-white" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <div className="text-[16px] text-[#282a35]">Phone number</div>
                    <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="h-14 rounded-full bg-white" />
                  </div>
                </div>
                {/* Right column: checkbox + publish button */}
                <div className="flex flex-col gap-3 md:justify-end">
                  <label className="inline-flex items-center gap-2">
                    <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(!!v)} />
                    <span className="text-sm text-[#282a35]">I agree to the terms of service</span>
                  </label>
                  <Button disabled={!canSubmit} onClick={submit} className="bg-[#ffa657] text-[#282a35] rounded-full px-9 py-4 disabled:opacity-50 w-[200px]">publish</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
