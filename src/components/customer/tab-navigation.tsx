'use client'

import { useTranslations } from 'next-intl'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const t = useTranslations('profile')
  
  return (
    <div className="w-full bg-white  mb-12">
      <div className="px-12 py-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => onTabChange('at-work')}
            className={`text-xl font-bold ${activeTab === 'at-work' ? 'text-[#282a35] opacity-80' : 'text-[#a3a3a3]'}`}
          >
            {t('atWork')}
          </button>
          <button 
            onClick={() => onTabChange('new-order')}
            className={`text-xl font-bold ${activeTab === 'new-order' ? 'text-[#282a35] opacity-80' : 'text-[#a3a3a3]'}`}
          >
            {t('newOrder')}
          </button>
          <button 
            onClick={() => onTabChange('selected-specialists')}
            className={`text-xl font-bold ${activeTab === 'selected-specialists' ? 'text-[#282a35] opacity-80' : 'text-[#a3a3a3]'}`}
          >
            {t('selectedSpecialists')}
          </button>
          <button 
            onClick={() => onTabChange('order-history')}
            className={`text-xl font-bold ${activeTab === 'order-history' ? 'text-[#282a35] opacity-80' : 'text-[#a3a3a3]'}`}
          >
            {t('history')}
          </button>
        </div>
        <div className="w-full h-px bg-[#282a35] opacity-20"></div>
      </div>
    </div>
  )
}
