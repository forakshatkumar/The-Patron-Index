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
    <div className='min-h-screen bg-white text-[#344563] font-sans selection:bg-[#0866F5]/20 selection:text-[#0B2345] overflow-x-hidden'>
      {/* 1. Header / Navbar with Logo & Links */}
      <Navbar onOpenDemo={handleOpenDemo} />

      <main id='main-content'>
        {/* 2. Hero Section: Two-Column with Customer Overview */}
        <HeroSection onOpenDemo={handleOpenDemo} />

        {/* 3. About Section with Laptop Visualization */}
        <AboutSection onOpenDemo={handleOpenDemo} />

        {/* 4. How It Works: 4 Simple Steps */}
        <HowItWorksSection onOpenDemo={handleOpenDemo} />

        {/* 5. Powerful Features: 4 Clean Cards */}
        <PowerfulFeaturesSection onOpenDemo={handleOpenDemo} />

        {/* 6. What Our Users Say: 3 Testimonial Cards */}
        <TestimonialsSection />

        {/* 7. Pre-Footer Banner */}
        <PreFooterBanner />
      </main>

      {/* 8. Footer */}
      <Footer onOpenPolicy={(policy) => setActiveModal(policy)} />

      {/* 9. Accessible Legal Modals (Privacy, Terms, Cookies, Data Deletion) */}
      <LegalModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  )
}
