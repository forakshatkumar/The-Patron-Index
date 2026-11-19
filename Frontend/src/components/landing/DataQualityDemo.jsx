import { useState } from 'react'
import { ShieldCheck, Lock, RefreshCw, CheckCircle } from 'lucide-react'
import { CSV_SAMPLE_ROWS } from '../../data/mock'

export default function DataQualityDemo () {
  const [rows] = useState(CSV_SAMPLE_ROWS)
  const [isScanning, setIsScanning] = useState(false)
  const [excludedRows, setExcludedRows] = useState([2, 3, 4, 6])

  const toggleExclude = (rowNum) => {
    setExcludedRows((prev) =>
      prev.includes(rowNum) ? prev.filter((r) => r !== rowNum) : [...prev, rowNum]
    )
  }

  const runValidationScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 700)
  }

  const total = rows.length
  const errorsCount = rows.filter((r) => r.status === 'error').length
  const duplicatesCount = rows.filter((r) => r.status === 'duplicate').length
  const validCount = rows.filter((r) => r.status === 'valid').length
  const activeValid = rows.filter((r) => !excludedRows.includes(r.row)).length

  return (
    <section id='data-audit' className='py-28 px-4 sm:px-6 lg:px-8 border-t border-[#222B36] bg-[#0B0F14]/95'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6'>
          <div>
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#3DD6A0]/15 text-[#3DD6A0] border border-[#3DD6A0]/30 mb-4'>
              <ShieldCheck className='w-3.5 h-3.5' />
              <span>PRD Section 5.3 // Data Quality Report</span>
            </span>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-2'>
              Automated CSV Quality Audit
            </h2>
            <p className='text-sm sm:text-base text-[#8A98A8] max-w-xl'>
              Scan transactions for negative values, malformed dates, and duplicate records. Problematic rows are isolated while your original file remains permanently unmodified.
            </p>
          </div>

          <div className='flex items-center gap-3'>
            {/* Original File Preserved Lock Badge */}
            <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121820] border border-[#222B36] text-xs text-[#3DD6A0] font-medium'>
              <Lock className='w-3.5 h-3.5' />
              <span>Original file preserved</span>
            </div>

            <button
              type='button'
              onClick={runValidationScan}
              disabled={isScanning}
              className='flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#0B0F14] bg-[#4F8CFF] hover:bg-[#689DFF] rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50'
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Rows...' : 'Run validation scan'}</span>
            </button>
          </div>
        </div>

        {/* Audit Metrics Summary Row */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
          <div className='p-4 rounded-xl bg-[#121820] border border-[#222B36] flex flex-col'>
            <span className='text-xs text-[#8A98A8] mb-1'>Rows Evaluated</span>
            <strong className='text-2xl font-bold text-[#E8EEF5] font-display'>{total}</strong>
            <span className='text-[10px] text-[#4F8CFF] mt-1'>Sample Ledger Data</span>
          </div>
          <div className='p-4 rounded-xl bg-[#121820] border border-[#222B36] flex flex-col'>
            <span className='text-xs text-[#8A98A8] mb-1'>Clean Records</span>
            <strong className='text-2xl font-bold text-[#3DD6A0] font-display'>{validCount}</strong>
            <span className='text-[10px] text-[#3DD6A0] mt-1'>Ready for scoring</span>
          </div>
          <div className='p-4 rounded-xl bg-[#121820] border border-[#222B36] flex flex-col'>
            <span className='text-xs text-[#8A98A8] mb-1'>Flagged Errors</span>
            <strong className='text-2xl font-bold text-[#FF5D6C] font-display'>{errorsCount}</strong>
            <span className='text-[10px] text-[#FF5D6C] mt-1'>Negative or missing IDs</span>
          </div>
          <div className='p-4 rounded-xl bg-[#121820] border border-[#222B36] flex flex-col'>
            <span className='text-xs text-[#8A98A8] mb-1'>Duplicates Caught</span>
            <strong className='text-2xl font-bold text-[#F5B83D] font-display'>{duplicatesCount}</strong>
            <span className='text-[10px] text-[#F5B83D] mt-1'>Isolated from scores</span>
          </div>
        </div>

        {/* Mini Interactive Table */}
        <div className='relative bg-[#121820] border border-[#222B36] rounded-2xl overflow-hidden shadow-2xl'>
          {/* Sweeping scan beam during validation */}
          {isScanning && (
            <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4F8CFF] to-transparent animate-pulse z-30' />
          )}

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs font-mono border-collapse'>
              <thead>
                <tr className='bg-[#18222E] text-[#8A98A8] border-b border-[#222B36]'>
                  <th className='py-3.5 px-4'>Row</th>
                  <th className='py-3.5 px-4'>Customer ID</th>
                  <th className='py-3.5 px-4'>Customer Name</th>
                  <th className='py-3.5 px-4'>Date</th>
                  <th className='py-3.5 px-4'>Amount</th>
                  <th className='py-3.5 px-4'>Validation Status</th>
                  <th className='py-3.5 px-4'>Issue / Coordinate</th>
                  <th className='py-3.5 px-4 text-center'>Exclude?</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[#222B36]/60 text-[#E8EEF5]'>
                {rows.map((row) => {
                  const isExcluded = excludedRows.includes(row.row)
                  const isError = row.status === 'error'
                  const isDuplicate = row.status === 'duplicate'

                  return (
                    <tr
                      key={row.row}
                      className={`transition-colors ${
                        isExcluded
                          ? 'opacity-40 bg-[#0B0F14]/50'
                          : isError
                          ? 'bg-[#FF5D6C]/5 hover:bg-[#FF5D6C]/10'
                          : isDuplicate
                          ? 'bg-[#F5B83D]/5 hover:bg-[#F5B83D]/10'
                          : 'hover:bg-[#18222E]/50'
                      }`}
                    >
                      <td className='py-3 px-4 font-semibold text-[#8A98A8]'>#{row.row}</td>
                      <td className='py-3 px-4'>
                        <span className={row.id === 'MISSING' ? 'text-[#FF5D6C] font-bold underline' : ''}>
                          {row.id}
                        </span>
                      </td>
                      <td className='py-3 px-4'>{row.name}</td>
                      <td className='py-3 px-4'>
                        <span className={row.date.includes('/31/02') ? 'text-[#FF5D6C] font-bold' : ''}>
                          {row.date}
                        </span>
                      </td>
                      <td className='py-3 px-4 font-semibold'>
                        <span className={row.amount.startsWith('-') ? 'text-[#FF5D6C]' : ''}>
                          {row.amount}
                        </span>
                      </td>
                      <td className='py-3 px-4'>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            row.status === 'valid'
                              ? 'bg-[#3DD6A0]/15 text-[#3DD6A0]'
                              : isError
                              ? 'bg-[#FF5D6C]/20 text-[#FF5D6C]'
                              : 'bg-[#F5B83D]/20 text-[#F5B83D]'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className='py-3 px-4 text-[11px] text-[#8A98A8]'>
                        {row.issue}
                      </td>
                      <td className='py-3 px-4 text-center'>
                        {row.canExclude && (
                          <button
                            type='button'
                            onClick={() => toggleExclude(row.row)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                              isExcluded
                                ? 'bg-[#FF5D6C]/20 text-[#FF5D6C] hover:bg-[#FF5D6C]/30'
                                : 'bg-[#18222E] text-[#8A98A8] hover:text-[#E8EEF5]'
                            }`}
                          >
                            {isExcluded ? 'Excluded' : 'Exclude'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className='p-4 bg-[#18222E]/80 border-t border-[#222B36] flex flex-wrap items-center justify-between text-xs text-[#8A98A8] gap-4'>
            <span>
              <strong>{activeValid} of {total} records</strong> eligible for Patron Index scoring after exclusions.
            </span>
            <span className='text-[11px] font-mono text-[#3DD6A0] flex items-center gap-1.5'>
              <CheckCircle className='w-3.5 h-3.5' />
              <span>Original uploaded CSV is locked &amp; untouched.</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

