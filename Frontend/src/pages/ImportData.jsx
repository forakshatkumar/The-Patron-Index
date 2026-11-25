import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { importCustomerCsv, uploadScan } from '../services/api'

function ImportData () {
  const { demoMode } = useAuth()
  const [file, setFile] = useState(null)
  const [validation, setValidation] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const selectionVersion = useRef(0)
  const requiredColumns = ['customer_id', 'name', 'purchase_date', 'amount']

  const select = selected => {
    if (loading) return
    selectionVersion.current++
    setFile(selected || null); setValidation(null); setResult(null); setError('')
  }

  const selectFile = event => select(event.target.files?.[0])
  const validate = () => {
    setValidation(null); setResult(null)
    if (!file) return setError('Please choose a CSV file first.')
    if (!file.name.toLowerCase().endsWith('.csv')) return setError('Customer import currently supports CSV files only.')
    if (file.size > 10 * 1024 * 1024) return setError('File size cannot exceed 10 MB.')

    const version = selectionVersion.current
    const reader = new FileReader()
    reader.onload = event => {
      if (version !== selectionVersion.current) return
      const lines = String(event.target.result || '').split(/\r?\n/).filter(line => line.trim())
      if (lines.length < 2) return setError('CSV must contain a header and at least one row.')
      const headers = lines[0].split(',').map(h => h.replaceAll('"', '').trim().toLowerCase())
      const missing = requiredColumns.filter(col => !headers.includes(col))
      if (missing.length) return setError(`Missing required columns: ${missing.join(', ')}`)
      setError(''); setValidation({ rows: lines.length - 1, headers })
    }
    reader.onerror = () => { if (version === selectionVersion.current) setError('Could not read this file. Choose it again.') }
    reader.readAsText(file)
  }

  const processFile = async () => {
    if (!validation || !file || loading || result) return
    setLoading(true); setError(''); setResult(null)
    try {
      if (demoMode) {
        await new Promise(resolve => setTimeout(resolve, 700))
        setResult({ scan: { status: 'completed', decision: 'allow' }, importedCustomers: Math.max(1, Math.round(validation.rows / 2)), processedRows: validation.rows, demo: true })
      } else {
        const scan = await uploadScan(file)
        if (scan.decision !== 'allow') throw new Error('The upload requires review and has not been imported.')
        const imported = await importCustomerCsv(file)
        setResult({ scan, ...imported })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='page import-page'>
      <div className='import-container'>
        <div className='page-heading'>
          <div>
            <h2>Import Customer Data</h2>
            <p>Securely validate, upload and classify customer purchase history.</p>
          </div>
        </div>
        <section className='card upload-card'>
          <div className='upload-area' onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); select(e.dataTransfer.files?.[0]) }}>
            <div className='upload-icon'>↑</div>
            <h3>Upload Purchase Data</h3>
            <p>Drag and drop a CSV or choose a file. Maximum 10 MB; up to 10,000 purchase rows.</p>
            <label className='file-button'>
              Choose CSV File
              <input type='file' accept='.csv,text/csv' className='visually-hidden' disabled={loading} onChange={selectFile} />
            </label>
            {file && (
              <div className='selected-file'>
                <strong>{file.name}</strong>
                <span>{(file.size / 1024).toFixed(2)} KB</span>
              </div>
            )}
          </div>
          <div className='upload-requirements'>
            <h4>Required columns</h4>
            <div className='required-columns'>
              {requiredColumns.map(column => <code key={column}>{column}</code>)}
            </div>
          </div>
          {error && <div className='upload-error' role='alert'>{error}</div>}
          {validation && (
            <div className='validation-success'>
              <h3>Local Validation Passed</h3>
              <p>{validation.rows} physical lines detected (quoted multiline fields may differ). The server validates each data row.</p>
            </div>
          )}
          {result && (
            <div className='validation-success'>
              <h3>Import Complete</h3>
              <p>{result.demo ? 'Demo processing complete.' : `${result.importedCustomers} customers classified from ${result.processedRows} purchase rows.`}</p>
              <div className='validation-details'>
                <span>Upload<strong>{result.scan?.decision === 'allow' ? 'Accepted' : 'Review'}</strong></span>
                <span>Scan Status<strong>{result.scan?.status || 'completed'}</strong></span>
                <span>Classification<strong>Complete</strong></span>
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link className='primary-button' to='/customers' style={{ padding: '8px 16px', fontSize: 13 }}>View Classified Customers →</Link>
                <Link className='secondary-button' to='/dashboard' style={{ padding: '8px 16px', fontSize: 13 }}>View Dashboard Trends</Link>
                <Link className='secondary-button' to='/transactions' style={{ padding: '8px 16px', fontSize: 13 }}>View Transactions</Link>
              </div>
            </div>
          )}
          <div className='upload-actions'>
            <button className='secondary-button' disabled={!file || loading || !!result} onClick={validate}>Validate File</button>
            <button className='primary-button' disabled={!validation || loading || !!result} onClick={processFile}>
              {loading ? 'Processing...' : 'Secure Upload & Classify'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ImportData
