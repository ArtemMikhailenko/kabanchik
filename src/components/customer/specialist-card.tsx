import { Button } from '@/components/ui/button'

// Icons
const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#A3A3A3"/>
  </svg>
)

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1.5L15.09 8.26L22.5 9.27L17.25 14.14L18.18 21.5L12 18.18L5.82 21.5L6.75 14.14L1.5 9.27L8.91 8.26L12 1.5Z" fill="#FFA657" stroke="#FFA657"/>
  </svg>
)

interface Specialist {
  id: number
  name: string
  avatar?: string
  location?: string
  reviews?: number
  positiveRating?: number
  rating?: number
}

interface SpecialistCardProps {
  specialist: Specialist
  onJobOffer?: (specialistId: number) => void
}

export const SpecialistCard = ({ specialist, onJobOffer }: SpecialistCardProps) => (
  <div className="w-full bg-white border border-[#e6e6e6] rounded-3xl p-6 mb-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
          <img 
            src={specialist.avatar || "/photo.png"} 
            alt={specialist.name || "Specialist"} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#282a35] opacity-80 mb-2">
            {specialist.name || "Specialist's name"}
          </h3>
          <div className="flex items-center gap-1">
            <LocationIcon />
            <span className="text-sm text-[#a3a3a3]">{specialist.location || 'Kyiv'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-9">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-medium text-[#282a35] opacity-80">
              {specialist.reviews || 456}
            </div>
            <div className="text-sm text-[#282a35] opacity-80">reviews</div>
          </div>
          <div className="w-px h-12 bg-[#a3a3a3]"></div>
          <div className="text-center">
            <div className="text-2xl font-medium text-[#282a35] opacity-80">
              {specialist.positiveRating || 99}%
            </div>
            <div className="text-sm text-[#282a35] opacity-80">positive</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} />
          ))}
        </div>
      </div>
      
      <Button 
        onClick={() => onJobOffer?.(specialist.id)}
        className="bg-[#55c4c8] text-[#282a35] px-9 py-6 rounded-full text-base font-medium hover:bg-[#4ab5b9] transition-colors"
      >
        Job offer
      </Button>
    </div>
  </div>
)
