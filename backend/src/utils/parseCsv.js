// Parse and validate all rows before any database writes. RFC-style quoted cells.
const MAX_ROWS = 10000;
function bad(message) { return Object.assign(new Error(message), { status: 400 }); }
function parseCsv(text, { collectErrors = false, allowBlankName = false } = {}) {
  const input = String(text || '').replace(/^\uFEFF/, '');
  const records = [];
  let row = [], cell = '', quoted = false, closed = false;
  const field = () => { row.push(cell.trim()); cell = ''; closed = false; };
  const record = () => { field(); if (row.some(Boolean)) records.push(row); row = []; if (records.length > MAX_ROWS + 1) throw bad(`CSV exceeds ${MAX_ROWS} data rows`); };
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"') { if (input[i+1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; } }
      else cell += ch;
    } else if (ch === ',') field();
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && input[i+1] === '\n') i++; record(); }
    else if (ch === '"' && !cell.trim() && !closed) { cell = ''; quoted = true; }
    else if (ch === '"' || (closed && ch.trim())) throw bad('Malformed CSV quoting');
    else cell += ch;
  }
  if (quoted) throw bad('Unclosed quoted CSV field');
  record();
  if (records.length < 2) throw bad('CSV must contain a header and at least one data row');
  const headers = records.shift().map(v => v.toLowerCase());
  if (new Set(headers).size !== headers.length || headers.some(v => !v || ['__proto__','constructor','prototype'].includes(v))) throw bad('Invalid or duplicate CSV columns');
  const missing = ['customer_id','name','purchase_date','amount'].filter(k => !headers.includes(k));
  if (missing.length) throw bad(`Missing required columns: ${missing.join(', ')}`);
  return records.map((values, i) => {
    try {
      if (values.length !== headers.length) throw bad(`Data row ${i+1}: unexpected column count`);
      const item = Object.fromEntries(headers.map((key,j) => [key, values[j]]));
      const amount = Number(item.amount);
      const date = new Date(item.purchase_date);
      if (!item.customer_id || (!allowBlankName && !item.name) || !item.amount || !Number.isFinite(amount) || amount < 0 || !item.purchase_date || !Number.isFinite(date.getTime())) throw bad(`Data row ${i+1}: provide customer ID, ${allowBlankName ? '' : 'name, '}valid date and non-negative amount`);
      if (/^\d{4}-\d{2}-\d{2}$/.test(item.purchase_date) && date.toISOString().slice(0,10) !== item.purchase_date) throw bad(`Data row ${i+1}: invalid calendar date`);
      return collectErrors ? { row: i+1, data: item } : item;
    } catch (error) {
      if (!collectErrors) throw error;
      return { row: i+1, error: error.message.replace(/^Data row \d+: /, '') };
    }
  });
}
module.exports = { parseCsv, MAX_ROWS };
