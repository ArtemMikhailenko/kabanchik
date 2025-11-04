import { Button } from '@/components/ui/button'

// Icons
const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#A3A3A3"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ToolIcon = ({ color }: { color: string }) => (
  <img src="/tools.svg" alt="" />
)

interface WorkOrderCardProps {
  order: {
    id: string
    title: string
    location: string
    deadline: string
    status: string
  }
  index: number
  onReview?: (orderId: string) => void
  onClose?: (orderId: string) => void
}

export const WorkOrderCard = ({ order, index, onReview, onClose }: WorkOrderCardProps) => {
  const colors = ['#55c4c8', '#ffa657', '#ffeb3b', '#9c27b0', '#e91e63', '#2196f3']
  const color = colors[index % colors.length]
  
  return (
    <div className="w-full bg-white border border-[#e6e6e6] rounded-3xl px-6 pt-4 pb-6 mb-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-4">
          {/* Left section with icon and text */}
          <div className="flex items-center gap-6">
            <div className='bg-[#55C4C8] rounded-full p-4 mt-2'>
                <ToolIcon color={color} />
            </div>
            
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-[#282a35] opacity-80 leading-[150%]">{order.title}</h3>
              <div className="flex items-end gap-3">
                <LocationIcon />
                <span className="text-sm text-[#a3a3a3] leading-[150%]">{order.location}</span>
              </div>
            </div>
          </div>
          
          {/* Center section with deadline and status */}
          <div className="flex items-center gap-4 ml-4">
            <span className="text-sm text-[#a3a3a3] leading-[150%]">{order.deadline}</span>
            <span className="text-sm text-[#55c4c8] leading-[150%]">{order.status}</span>
          </div>
        </div>
        
        {/* Right section with buttons */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => onReview?.(order.id)}
            className="bg-[#55c4c8] text-[#282a35] px-9 py-6 rounded-full text-base font-medium hover:bg-[#4ab5b9] transition-colors leading-[120%]"
          >
            Review
          </Button>
          <button 
            onClick={() => onClose?.(order.id)}
            className="flex items-center justify-center w-6 h-6  hover:bg-gray-100 rounded-full transition-colors "
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
