import React from 'react'
import Image from 'next/image'

const partners = [
  { name: 'Google', logo: '/partners/Google.png' },
  { name: 'Facebook', logo: '/partners/facebook.png' },
  { name: 'YouTube', logo: '/partners/YouTube.png' },
  { name: 'Pinterest', logo: '/partners/Pinterest.png' },
  { name: 'Twitch', logo: '/partners/Twitch.png' },
  { name: 'Webflow', logo: '/partners/Webflow.png' },
]

export default function PartnersSection() {
  return (
    <section className="pt-16 bg-[#ffd2aa]">
      <div className="py-10 bg-white rounded-t-[30px] md:rounded-t-[60px]">
        <div className=" mx-auto ">
          <div className=" mx-auto text-center">
            <h2 className="text-3xl md:text-[64px] font-bold text-gray-900 mb-12">
              Our partners
            </h2>

            <div className="relative overflow-hidden">
              <div className="flex animate-scroll">
                ={' '}
                {partners.map((partner, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-16 w-48 mx-8"
                  >
                    <div className="relative h-12 w-32  transition-all duration-300 ">
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100px, 128px"
                      />
                    </div>
                  </div>
                ))}
                {partners.map((partner, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-16 w-48 mx-8"
                  >
                    <div className="relative h-12 w-32  transition-all duration-300 ">
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100px, 128px"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
          width: max-content;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
