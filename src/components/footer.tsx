import React from 'react'
import Link from 'next/link'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

const paymentMethods = [
  'PayPal',
  'Stripe',
  'Payoneer',
  'Apple Pay',
  'Google Pay',
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-6">LOGO</h3>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">About us</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contacts"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Contacts
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Questions and answers
                </Link>
              </li>
              <li>
                <Link
                  href="/offer"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Public offer
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Support service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">How it works</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-to-order"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  How to order a service
                </Link>
              </li>
              <li>
                <Link
                  href="/benefits"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Benefits for companies
                </Link>
              </li>
              <li>
                <Link
                  href="/register-specialist"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  How to register a sole proprietorship
                </Link>
              </li>
              <li>
                <Link
                  href="/guarantee"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Guarantee and security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow us</h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-[#FFA657] transition-colors"
                  >
                    <IconComponent className="w-5 h-5 text-[#FFA657]" />
                  </Link>
                )
              })}
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-300">
                    Leithestraat 45, Gouda,
                  </p>
                  <p className="text-sm text-gray-300">
                    South Holland, Netherlands
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-300">0182 522 200</p>
                  <p className="text-sm text-gray-300">0182 522 200</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-300">0182 522 200@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              Copyright © 2024 Copyright | All Rights Reserved
            </p>

            <div className="flex items-center space-x-4">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-400 px-3 py-1 bg-gray-800 rounded"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
