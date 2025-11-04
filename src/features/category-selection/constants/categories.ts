import { Category } from '../types'

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Web Development', orders: 125 },
  { id: 2, name: 'Graphic Design', orders: 89 },
  { id: 3, name: 'Digital Marketing', orders: 156 },
  { id: 4, name: 'Content Writing', orders: 67 },
  { id: 5, name: 'Video Editing', orders: 43 },
  { id: 6, name: 'Mobile App Development', orders: 78 },
  { id: 7, name: 'SEO Optimization', orders: 92 },
  { id: 8, name: 'Social Media Management', orders: 134 },
  { id: 9, name: 'Translation Services', orders: 56 },
  { id: 10, name: 'Voice Over', orders: 34 },
  { id: 11, name: 'Data Entry', orders: 87 },
  { id: 12, name: 'Virtual Assistant', orders: 145 },
  { id: 13, name: 'Logo Design', orders: 76 },
  { id: 14, name: 'Photography', orders: 65 },
  { id: 15, name: 'Accounting', orders: 54 },
  { id: 16, name: 'Legal Consulting', orders: 32 }
]

export const SUBCATEGORIES: Record<string, string[]> = {
  'Web Development': [
    'Frontend Development',
    'Backend Development', 
    'Full Stack Development',
    'WordPress Development',
    'E-commerce Development',
    'API Development',
    'Web Application Development',
    'Website Maintenance',
    'CMS Development',
    'JavaScript Development',
    'React Development',
    'Vue.js Development',
    'Angular Development',
    'Node.js Development',
    'PHP Development',
    'Python Development',
    'Database Design',
    'UI/UX Implementation',
    'Website Optimization',
    'Bug Fixing'
  ],
  'Graphic Design': [
    'Logo Design',
    'Business Card Design',
    'Brochure Design',
    'Banner Design',
    'Poster Design',
    'Social Media Graphics',
    'Web Design',
    'App Design',
    'Print Design',
    'Packaging Design',
    'Icon Design',
    'Illustration',
    'Brand Identity',
    'Marketing Materials',
    'Presentation Design',
    'Infographic Design'
  ],
  'Digital Marketing': [
    'Social Media Marketing',
    'Content Marketing',
    'Email Marketing',
    'PPC Advertising',
    'SEO Services',
    'Influencer Marketing',
    'Affiliate Marketing',
    'Video Marketing',
    'Mobile Marketing',
    'Marketing Strategy',
    'Brand Marketing',
    'Growth Hacking',
    'Conversion Optimization',
    'Analytics Setup'
  ]
}
