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

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#34979A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1.66663L15.8334 3.33329V9.16663C15.8334 12.8333 13.3334 16.1666 10 17.5C6.66671 16.1666 4.16671 12.8333 4.16671 9.16663V3.33329L10 1.66663Z" stroke="#34979A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ThumbsUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10V20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V12C2 11.4696 2.21071 10.9609 2.58579 10.5858C2.96086 10.2107 3.46957 10 4 10H7ZM7 10L10.4649 3.00154C10.7047 2.52888 11.0669 2.12451 11.5151 1.8364C11.9633 1.54829 12.4813 1.38792 13.0144 1.37171C13.5476 1.3555 14.0738 1.48406 14.5412 1.74397C15.0087 2.00389 15.3997 2.38596 15.6698 2.85034C15.9399 3.31473 16.0787 3.84394 16.0701 4.38007C16.0615 4.91621 15.9059 5.44039 15.6198 5.89434L14 8.5H20C20.5304 8.5 21.0391 8.71071 21.4142 9.08579C21.7893 9.46086 22 9.96957 22 10.5V11.4C22 11.7077 21.9407 12.0126 21.8253 12.2985L19.0382 19.0382C18.7676 19.6457 18.3154 20.1607 17.7413 20.5166C17.1672 20.8726 16.4985 21.0548 15.8181 21.04H7" stroke="#34979A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface TestimonialCardProps {
  text: string
}

const TestimonialCard = ({ text }: TestimonialCardProps) => (
  <div className="w-[345px] bg-white border border-[#e6e6e6] rounded-lg p-6">
    <div className="flex items-center gap-2 mb-2">
      <ThumbsUpIcon />
      <span className="text-base font-bold text-[#34979a]">TOP specialist</span>
    </div>
    <p className="text-sm text-[#282a35] opacity-80 leading-[150%]">{text}</p>
  </div>
)

interface SpecialistProfileProps {
  specialist: {
    name: string
    avatar: string
    location: string
    reviews: number
    positiveRating: number
    tariffPlan: {
      name: string
      validUntil: string
    }
  }
  testimonials: Array<{ id: number; text: string }>
}

export const SpecialistProfile = ({ specialist, testimonials }: SpecialistProfileProps) => (
  <div className="w-full bg-white rounded-2xl border border-[#e6e6e6] p-9 mb-12">
    <div className="flex gap-7">
      {/* Left Section - Specialist Info */}
      <div className="flex-1">
        <div className="flex gap-6 mb-5">
          {/* Avatar */}
          <div className="w-[180px] h-[180px] rounded-full bg-gray-200 overflow-hidden">
            <img src={specialist.avatar} alt={specialist.name} className="w-full h-full object-cover" />
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <h1 className="text-[32px] font-bold text-[#282a35] opacity-80 mb-3 leading-[150%]">{specialist.name}</h1>
            
            <div className="flex items-center gap-1 mb-6">
              <LocationIcon />
              <span className="text-sm text-[#282a35] opacity-80">{specialist.location}</span>
            </div>
            
            {/* Reviews and Rating */}
            <div className="flex items-center gap-9 mb-5">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-2xl font-medium text-[#282a35] opacity-80 leading-[140%]">{specialist.reviews}</div>
                  <div className="text-sm text-[#282a35] opacity-80">reviews</div>
                </div>
                <div className="w-px h-12 bg-[#a3a3a3]"></div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-[#282a35] opacity-80 leading-[140%]">{specialist.positiveRating}%</div>
                  <div className="text-sm text-[#282a35] opacity-80">positive</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} />
                ))}
              </div>
            </div>
            
            {/* Tariff Plan */}
            <div className="bg-white border border-[#e6e6e6] rounded-lg p-6 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-7">
                  <span className="text-base font-medium text-[#282a35] opacity-80">My tariff plan</span>
                  <div className="w-px h-9 bg-[#282a35] opacity-20"></div>
                  <div>
                    <div className="text-base font-bold text-[#282a35] opacity-80 leading-[140%]">{specialist.tariffPlan.name}</div>
                    <div className="text-xs text-[#a3a3a3] leading-[130%]">valid until {specialist.tariffPlan.validUntil}</div>
                  </div>
                </div>
                <Button className="bg-[#ffa657] text-[#282a35] px-9 py-4 rounded-full text-base font-medium hover:bg-[#ff9944]">
                  extend
                </Button>
              </div>
            </div>
            
            {/* Verification Badges */}
            <div className="flex items-center gap-9">
              <div className="flex items-center gap-1">
                <CheckIcon />
                <span className="text-sm font-medium text-[#34979a]">Verified information</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldIcon />
                <span className="text-sm font-medium text-[#34979a]">Customer safety</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section - Testimonials */}
      <div className="w-[345px] flex flex-col gap-4">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} text={testimonial.text} />
        ))}
      </div>
    </div>
  </div>
)
