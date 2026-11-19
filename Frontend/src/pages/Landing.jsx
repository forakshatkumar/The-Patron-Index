import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/landing/Navbar'
import PatronThread from '../components/landing/PatronThread'
import HeroSection from '../components/landing/HeroSection'
import ProblemSection from '../components/landing/ProblemSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import DataQualityDemo from '../components/landing/DataQualityDemo'
import SegmentsSection from '../components/landing/SegmentsSection'
import PatronScoreSection from '../components/landing/PatronScoreSection'
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection'
import RecommendationsSection from '../components/landing/RecommendationsSection'
import BuiltForTrustSection from '../components/landing/BuiltForTrustSection'
import WhoItsForSection from '../components/landing/WhoItsForSection'
import FinalCtaSection from '../components/landing/FinalCtaSection'
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
    <div className='relative min-h-screen bg-[#0B0F14] text-[#E8EEF5] font-sans selection:bg-[#4F8CFF]/30 selection:text-[#E8EEF5]'>
      {/* 0. Navbar */}
      <Navbar onOpenDemo={handleOpenDemo} />

      {/* Narrative Spine: The Patron Thread SVG Device */}
      <PatronThread />

      <main id='main-content' className='relative z-20'>
        {/* 1. Hero Section */}
        <HeroSection onOpenDemo={handleOpenDemo} />

        {/* 2. The Problem Section */}
        <ProblemSection />

        {/* 3. How It Works Section */}
        <HowItWorksSection />

        {/* 4. Data Quality Demo (interactive) */}
        <DataQualityDemo />

        {/* 5. Segments (interactive) */}
        <SegmentsSection />

        {/* 6. Patron Index Score (interactive) */}
        <PatronScoreSection />

        {/* 7. Dashboard Preview */}
        <DashboardPreviewSection />

        {/* 8. Recommendations */}
        <RecommendationsSection />

        {/* 9. Built for Trust */}
        <BuiltForTrustSection />

        {/* 10. Who It's For */}
        <WhoItsForSection onOpenDemo={handleOpenDemo} />

        {/* 11. Final CTA & Footer */}
        <FinalCtaSection
          onOpenDemo={handleOpenDemo}
          onOpenPolicy={(policy) => setActiveModal(policy)}
        />
      </main>

      {/* Accessible Legal Modals */}
      <LegalModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  )
}
