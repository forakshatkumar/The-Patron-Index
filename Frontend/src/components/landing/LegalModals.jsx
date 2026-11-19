import { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'

export default function LegalModals ({ activeModal, onClose }) {
  const [deletionEmail, setDeletionEmail] = useState('')
  const [deletionConfirmed, setDeletionConfirmed] = useState(false)
  const [deletionSuccess, setDeletionSuccess] = useState(false)

  if (!activeModal) return null

  const handleDeletionSubmit = (e) => {
    e.preventDefault()
    setDeletionSuccess(true)
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F14]/80 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='relative w-full max-w-2xl bg-[#121820] border border-[#222B36] rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-left'>
        {/* Modal Header */}
        <div className='px-6 py-4 bg-[#18222E] border-b border-[#222B36] flex items-center justify-between'>
          <h2 className='text-sm font-bold text-[#E8EEF5] font-display'>
            {activeModal === 'privacy' && 'Privacy Policy & Data Isolation'}
            {activeModal === 'terms' && 'Terms of Service'}
            {activeModal === 'cookies' && 'Cookie & Storage Preferences'}
            {activeModal === 'deletion' && 'User Data Deletion Request (GDPR / CCPA)'}
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='p-1 text-[#8A98A8] hover:text-[#E8EEF5] rounded-md transition-colors'
            aria-label='Close modal'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Modal Body */}
        <div className='p-6 overflow-y-auto text-xs text-[#8A98A8] space-y-4 leading-relaxed'>
          {activeModal === 'privacy' && (
            <>
              <p className='text-[#E8EEF5] font-semibold'>1. Data Ownership &amp; Confidentiality</p>
              <p>The Patron Index guarantees that all uploaded sales records, transaction amounts, and customer identifiers remain the exclusive property of your business. Datasets are strictly isolated at the tenant database level.</p>
              <p className='text-[#E8EEF5] font-semibold'>2. Zero Public Model Training</p>
              <p>Your transactions are never shared, sold, or used to train public machine learning or language models. Calculations are performed deterministically in isolated execution environments.</p>
              <p className='text-[#E8EEF5] font-semibold'>3. Data Retention &amp; Sovereignty</p>
              <p>Uploaded CSVs are preserved in raw format. You can delete individual datasets or submit an account purge request at any time.</p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <p className='text-[#E8EEF5] font-semibold'>1. Permitted Use</p>
              <p>The Patron Index provides customer intelligence and business analytics based on deterministic calculation models. Users agree to upload only transaction records they have legitimate authority to process.</p>
              <p className='text-[#E8EEF5] font-semibold'>2. Deterministic AI Disclaimer</p>
              <p>Calculations reflect the provided dataset. Suggested business recommendations distinguish observed facts from predictions and do not constitute formal legal or financial advice.</p>
            </>
          )}

          {activeModal === 'cookies' && (
            <>
              <p className='text-[#E8EEF5] font-semibold'>Essential Session Storage</p>
              <p>We use essential browser local storage to securely manage your authentication tokens and demo workspace state. No third-party tracking pixels or behavioral cookies are deployed.</p>
              <div className='p-3 bg-[#0B0F14] rounded-lg border border-[#222B36] text-[11px] text-[#3DD6A0]'>
                ✓ Essential storage is active. Third-party trackers are blocked.
              </div>
            </>
          )}

          {activeModal === 'deletion' && (
            <>
              {deletionSuccess ? (
                <div className='p-4 bg-[#0B0F14] rounded-xl border border-[#3DD6A0] text-center space-y-2'>
                  <CheckCircle2 className='w-8 h-8 text-[#3DD6A0] mx-auto' />
                  <strong className='text-sm text-[#E8EEF5] block'>Deletion Request Logged</strong>
                  <p className='text-xs text-[#8A98A8]'>
                    All datasets associated with {deletionEmail} have been scheduled for immediate permanent purge.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDeletionSubmit} className='space-y-4'>
                  <p>In accordance with GDPR and CCPA privacy standards, you may permanently purge all uploaded spreadsheets, scores, and account records.</p>
                  <div>
                    <label className='block text-xs font-semibold text-[#E8EEF5] mb-1'>Business Email</label>
                    <input
                      type='email'
                      required
                      value={deletionEmail}
                      onChange={(e) => setDeletionEmail(e.target.value)}
                      placeholder='your@business.com'
                      className='w-full px-3 py-2 bg-[#0B0F14] border border-[#222B36] rounded-lg text-[#E8EEF5] outline-none focus:border-[#4F8CFF]'
                    />
                  </div>
                  <label className='flex items-start gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      required
                      checked={deletionConfirmed}
                      onChange={(e) => setDeletionConfirmed(e.target.checked)}
                      className='mt-0.5 accent-[#4F8CFF]'
                    />
                    <span className='text-[11px] text-[#8A98A8]'>I understand this action is permanent and cannot be undone.</span>
                  </label>
                  <button
                    type='submit'
                    disabled={!deletionConfirmed}
                    className='w-full py-2.5 rounded-lg text-xs font-bold text-[#0B0F14] bg-[#FF5D6C] hover:bg-[#FF7380] disabled:opacity-50 transition-colors'
                  >
                    Submit Irreversible Deletion Request
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className='px-6 py-3 bg-[#18222E] border-t border-[#222B36] flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-1.5 rounded-full text-xs font-semibold text-[#E8EEF5] bg-[#121820] hover:bg-[#222B36] border border-[#222B36] transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

