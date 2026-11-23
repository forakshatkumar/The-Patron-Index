import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import AboutSection from '../components/landing/AboutSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import PowerfulFeaturesSection from '../components/landing/PowerfulFeaturesSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import PreFooterBanner from '../components/landing/PreFooterBanner'
import Footer from '../components/landing/Footer'
import LegalModals from '../components/landing/LegalModals'

export default function Landing () {
  const navigate = useNavigate()
  const { enterDemo } = useAuth()
  const [activeModal, setActiveModal] = useState(null)

  const handleOpenDemo = () => {
    enterDemo()
    navigate('/dashboard')
  }

  return (
    <div className='min-h-screen bg-white text-slate-800 font-sans selection:bg-[#0066FF]/20 selection:text-[#0B2545]'>
      {/* 1. Header / Navbar with Logo & Links */}
      <Navbar onOpenDemo={handleOpenDemo} />

      <main id='main-content'>
        {/* 2. Hero Section: "The Patron Index - Where Buyers Become Insight" + Customer Overview card */}
        <HeroSection onOpenDemo={handleOpenDemo} />

        {/* 3. About Section: "Understand your customers. Grow your business." + Laptop Preview */}
        <AboutSection onOpenDemo={handleOpenDemo} />

        {/* 4. How It Works: 4 Simple Steps */}
        <HowItWorksSection onOpenDemo={handleOpenDemo} />

        {/* 5. Powerful Features: 4 Clean Cards */}
        <PowerfulFeaturesSection onOpenDemo={handleOpenDemo} />

        {/* 6. What Our Users Say: 3 Testimonial Cards */}
        <TestimonialsSection />

        {/* 7. Pre-Footer Banner: "Ready to unlock the power of your customer data?" */}
        <PreFooterBanner />
      </main>

      {/* 8. Footer: Brand, Links, Socials, Legal Compliance */}
      <Footer onOpenPolicy={(policy) => setActiveModal(policy)} />

      {/* 9. Accessible Legal Modals (Privacy, Terms, Cookies, Data Deletion) */}
      <LegalModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  )
}
