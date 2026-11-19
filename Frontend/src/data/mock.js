export const HERO_PARTICLES = [
  { id: 1, x: 20, y: 35, segment: 'vip', color: 'var(--vip)', label: 'Aarav (VIP)' },
  { id: 2, x: 45, y: 25, segment: 'loyal', color: 'var(--loyal)', label: 'Priya (Loyal)' },
  { id: 3, x: 75, y: 40, segment: 'regular', color: 'var(--regular)', label: 'Rohan (Regular)' },
  { id: 4, x: 30, y: 65, segment: 'new', color: 'var(--new)', label: 'Ananya (New)' },
  { id: 5, x: 60, y: 75, segment: 'at-risk', color: 'var(--at-risk)', label: 'Vikram (At-Risk)' },
  { id: 6, x: 85, y: 60, segment: 'inactive', color: 'var(--inactive)', label: 'Neha (Inactive)' },
  { id: 7, x: 50, y: 50, segment: 'occasional', color: 'var(--occasional)', label: 'Karan (Occasional)' }
]

export const MESSY_FRAGMENTS = [
  { text: 'Row #412: Date = "31/02/2026" (Inconsistent Format)', x: -20, y: -30, delay: 0.1 },
  { text: 'Cust_ID: NULL | Amount = -₹1,240 (Negative Value)', x: 30, y: -45, delay: 0.25 },
  { text: 'Duplicate Order: #ORD-9821 copied 3 times', x: -40, y: 20, delay: 0.4 },
  { text: 'Who is your highest value repeat customer?', x: 40, y: 35, delay: 0.55 },
  { text: 'Which customers stopped purchasing 60 days ago?', x: -10, y: 55, delay: 0.7 }
]

export const STEPS_DATA = [
  {
    step: 1,
    title: 'Sign Up',
    summary: 'Instant business profile setup with isolated multi-tenant workspace.',
    detail: 'Create your account in under 60 seconds with no credit card required. Data isolation is provisioned immediately.',
    badge: 'Step 01'
  },
  {
    step: 2,
    title: 'Upload CSV',
    summary: 'Drag and drop your standard sales export from POS, Shopify, or Excel.',
    detail: 'Supports standard CSV columns: customer_id, name, purchase_date, amount, and optional product categories.',
    badge: 'Step 02'
  },
  {
    step: 3,
    title: 'Validate',
    summary: 'Automated audit isolates missing IDs, duplicate rows, and date anomalies.',
    detail: 'Every row is scanned with exact coordinate tagging. Your original file remains 100% untouched on disk.',
    badge: 'Step 03'
  },
  {
    step: 4,
    title: 'Process & Clean',
    summary: 'Filter excluded records and normalize transaction intervals.',
    detail: 'Clean records are mapped into uniform time-series intervals for deterministic scoring.',
    badge: 'Step 04'
  },
  {
    step: 5,
    title: 'Segment & Score',
    summary: 'Calculate deterministic 0–100 Patron Index scores across 7 classes.',
    detail: 'Algorithms combine Recency, Frequency, Spend, and Loyalty into an explainable score for each customer.',
    badge: 'Step 05'
  },
  {
    step: 6,
    title: 'Insights & Actions',
    summary: 'Receive practical, grounded business steps linked directly to observed data.',
    detail: 'Practical recommendations distinguish observed facts from predictions to drive immediate retention.',
    badge: 'Step 06'
  }
]

export const CSV_SAMPLE_ROWS = [
  {
    row: 1,
    id: 'CUST-1041',
    name: 'Aarav Mehta',
    date: '2026-10-14',
    amount: '₹14,500',
    status: 'valid',
    issue: 'None (Clean Record)',
    canExclude: false
  },
  {
    row: 2,
    id: 'CUST-1042',
    name: 'Priya Sharma',
    date: '2026-10-15',
    amount: '-₹450',
    status: 'error',
    issue: 'Negative amount flagged in col "Amount"',
    canExclude: true
  },
  {
    row: 3,
    id: 'MISSING',
    name: 'Rohan Verma',
    date: '2026-10-16',
    amount: '₹3,200',
    status: 'error',
    issue: 'Missing customer identifier in col "ID"',
    canExclude: true
  },
  {
    row: 4,
    id: 'CUST-1041',
    name: 'Aarav Mehta',
    date: '2026-10-14',
    amount: '₹14,500',
    status: 'duplicate',
    issue: 'Duplicate transaction record detected',
    canExclude: true
  },
  {
    row: 5,
    id: 'CUST-1045',
    name: 'Ananya Gupta',
    date: '2026-10-18',
    amount: '₹22,400',
    status: 'valid',
    issue: 'None (Clean Record)',
    canExclude: false
  },
  {
    row: 6,
    id: 'CUST-1046',
    name: 'Vikram Rao',
    date: '2026/31/02',
    amount: '₹5,600',
    status: 'error',
    issue: 'Invalid date format (non-existent day)',
    canExclude: true
  },
  {
    row: 7,
    id: 'CUST-1047',
    name: 'Neha Kapoor',
    date: '2026-10-21',
    amount: '₹1,850',
    status: 'valid',
    issue: 'None (Clean Record)',
    canExclude: false
  },
  {
    row: 8,
    id: 'CUST-1048',
    name: 'Karan Malhotra',
    date: '2026-10-22',
    amount: '₹34,000',
    status: 'valid',
    issue: 'None (Clean Record)',
    canExclude: false
  }
]

export const SEGMENTS_DATA = [
  {
    id: 'vip',
    name: 'VIP Customers',
    color: 'var(--vip)',
    percentage: 8,
    count: 198,
    avgSpend: '₹48,200',
    frequency: '28 orders / yr',
    definition: 'Top 8% lifetime spenders with exceptionally high purchase frequency.',
    typicalBehaviour: 'High trust, early adopters of new stock, visits weekly.',
    suggestedAction: 'Deliver personalized white-glove check-ins and exclusive first-look privileges.'
  },
  {
    id: 'loyal',
    name: 'Loyal Customers',
    color: 'var(--loyal)',
    percentage: 24,
    count: 596,
    avgSpend: '₹24,800',
    frequency: '16 orders / yr',
    definition: 'Dependable repeat shoppers with strong brand affinity and steady spend.',
    typicalBehaviour: 'Frequent orders, low discount sensitivity, high basket diversity.',
    suggestedAction: 'Provide loyalty tier milestone rewards to advance them to VIP status.'
  },
  {
    id: 'regular',
    name: 'Regular Customers',
    color: 'var(--regular)',
    percentage: 35,
    count: 868,
    avgSpend: '₹11,400',
    frequency: '8 orders / yr',
    definition: 'Consistent buyers with predictable monthly or bi-monthly intervals.',
    typicalBehaviour: 'Predictable basket sizes, sensitive to seasonal promotions.',
    suggestedAction: 'Incentivize cross-sell bundles to increase average transaction volume.'
  },
  {
    id: 'new',
    name: 'New Customers',
    color: 'var(--new)',
    percentage: 9,
    count: 224,
    avgSpend: '₹4,200',
    frequency: '1.2 orders / yr',
    definition: 'Recently acquired first-time buyers within the last 30 to 45 days.',
    typicalBehaviour: 'Evaluating product quality; single transaction recorded.',
    suggestedAction: 'Trigger a warm 14-day onboarding follow-up with a second-purchase coupon.'
  },
  {
    id: 'occasional',
    name: 'Occasional Customers',
    color: 'var(--occasional)',
    percentage: 10,
    count: 248,
    avgSpend: '₹6,100',
    frequency: '3.4 orders / yr',
    definition: 'Sporadic buyers whose visits correlate with seasonal clearance sales.',
    typicalBehaviour: 'High discount affinity with long dormant windows.',
    suggestedAction: 'Re-engage during annual marquee promotions and festive sale cycles.'
  },
  {
    id: 'at-risk',
    name: 'At-Risk Customers',
    color: 'var(--at-risk)',
    percentage: 14,
    count: 348,
    avgSpend: '₹16,900',
    frequency: 'Purchase gap > 90 days',
    definition: 'Previously active customers whose repurchase gap exceeds standard cadence.',
    typicalBehaviour: 'Purchase interval increased by 2.4x historical average.',
    suggestedAction: 'Send targeted "We miss you" re-engagement offers before complete lapse.'
  },
  {
    id: 'inactive',
    name: 'Inactive Customers',
    color: 'var(--inactive)',
    percentage: 0, // remainder
    count: 142,
    avgSpend: '₹7,300',
    frequency: 'Purchase gap > 180 days',
    definition: 'Customers who have not purchased for an extended multi-month duration.',
    typicalBehaviour: 'Zero recent email engagement or store visits.',
    suggestedAction: 'Run automated low-cost win-back campaigns or safely archive records.'
  }
]

export const RECOMMENDATIONS_DATA = [
  {
    id: 1,
    observation: '14% of high-value VIP patrons have exceeded their historical 45-day repurchasing cadence.',
    suggestedAction: 'Deploy a personalized concierge message or tailored restock reminder to prevent high-tier churn.',
    metric: '₹2.8L at stake across 34 patrons',
    tag: 'Retention Priority'
  },
  {
    id: 2,
    observation: '42% of first-time buyers do not place a second order within 60 days of initial purchase.',
    suggestedAction: 'Implement an automated 14-day post-purchase check-in sequence offering 10% off their second basket.',
    metric: 'Repeat rate potential: +18%',
    tag: 'Growth Incentive'
  },
  {
    id: 3,
    observation: 'The top 8% of customers generate 32% of your total business revenue.',
    suggestedAction: 'Formalize an exclusive VIP loyalty tier to safeguard your core revenue foundation against competitor outreach.',
    metric: '32% Revenue Concentration',
    tag: 'Revenue Foundation'
  },
  {
    id: 4,
    observation: 'Occasional customers show a 64% dependency on seasonal discount codes to complete orders.',
    suggestedAction: 'Introduce bundled product offerings with protected margins rather than margin-diluting discount codes.',
    metric: 'Margin protection: +7.4%',
    tag: 'Margin Protection'
  },
  {
    id: 5,
    observation: 'Overall customer purchase frequency has declined by 11% across the last two calendar quarters.',
    suggestedAction: 'Conduct a sample customer satisfaction survey to identify whether inventory or pricing changes caused friction.',
    metric: 'Cadence gap: -11% QoQ',
    tag: 'Investigation'
  }
]

export const TRUST_CARDS = [
  {
    icon: 'ShieldCheck',
    title: 'Isolated Multi-Tenant Security',
    desc: 'Every database query and dataset reference is scoped directly to your authenticated business ID. No business can view another account\'s records.'
  },
  {
    icon: 'FileLock2',
    title: 'Original File Unmodified',
    desc: 'Uploaded CSV files are read-only and preserved permanently in raw form. Problematic rows are isolated into audit views without altering source data.'
  },
  {
    icon: 'Cpu',
    title: 'Deterministic Logic',
    desc: 'Calculations are pure mathematics based on Recency, Frequency, Spend, and Loyalty. AI only explains findings and suggests actions; it never invents numbers.'
  },
  {
    icon: 'Lock',
    title: 'Server-Side Sanitization',
    desc: 'Enforced file size caps (10 MB), strict CSV type validation, and input sanitization protect against malicious formatting and binary injection attempts.'
  },
  {
    icon: 'Trash2',
    title: 'Transparent Data Deletion',
    desc: 'You maintain 100% data sovereignty. Delete uploaded datasets at any time or submit an automated GDPR/CCPA purge request with one click.'
  },
  {
    icon: 'EyeOff',
    title: 'Zero Public Model Leakage',
    desc: 'Your business transaction data is never sold, rented, or fed into public LLM training datasets. Your numbers remain confidential.'
  }
]

export const PERSONAS_DATA = [
  {
    id: 'shopkeepers',
    label: 'Small Shop Owners',
    need: 'Identify regular counter shoppers and catch drop-offs before they disappear.',
    quote: 'I want to know which regulars are slowly stopping by less often, without spending my Sunday in Excel.'
  },
  {
    id: 'retailers',
    label: 'Retailers',
    need: 'Analyze purchasing intervals, basket size, and inventory affinity.',
    quote: 'We need clear segmentation so we can send the right promotions to the right buyers.'
  },
  {
    id: 'sellers',
    label: 'Independent Online Sellers',
    need: 'Maximize customer lifetime value and drive second-purchase repeat conversions.',
    quote: 'Acquiring customers is expensive. I need to make sure one-time buyers become regular patrons.'
  },
  {
    id: 'small-business',
    label: 'Small Businesses',
    need: 'Unify sales records into an explainable 0 to 100 customer loyalty score.',
    quote: 'We need clean, deterministic scoring our entire team can understand at a glance.'
  },
  {
    id: 'growing',
    label: 'Growing Businesses',
    need: 'Compare customer segments across branches with complete tenant data isolation.',
    quote: 'As we open multiple outlets, we need consistent loyalty intelligence across every location.'
  }
]

