function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculatePatronIndex({ recency = 0, frequency = 0, monetary = 0 }) {
  const recencyScore = clamp(100 - Number(recency || 0), 0, 100);
  const frequencyScore = clamp(Number(frequency || 0) * 5, 0, 100);
  const monetaryScore = clamp(Number(monetary || 0) / 1000, 0, 100);

  return Math.round(
    recencyScore * 0.35 + frequencyScore * 0.3 + monetaryScore * 0.35
  );
}

function classifyCustomer({ recency = 0, frequency = 0, monetary = 0, patronIndex }) {
  const score = patronIndex ?? calculatePatronIndex({ recency, frequency, monetary });

  if (Number(recency) >= 120) return 'Inactive';
  if (Number(recency) >= 60) return 'At-Risk';
  if (Number(frequency) <= 2 && Number(recency) <= 30) return 'New';
  if (score >= 85 || (Number(monetary) >= 75000 && Number(frequency) >= 15)) return 'VIP';
  if (score >= 70 || Number(frequency) >= 12) return 'Loyal';
  if (Number(frequency) >= 6) return 'Regular';
  return 'Occasional';
}

function recommendationFor(segment) {
  const recommendations = {
    VIP: 'Offer exclusive benefits, early access and premium rewards.',
    Loyal: 'Reward loyalty and recommend relevant products based on purchase history.',
    Regular: 'Use targeted bundles or cross-sell offers to increase customer value.',
    New: 'Send a welcome offer and guide the customer toward a second purchase.',
    Occasional: 'Use timely reminders and seasonal offers to improve purchase frequency.',
    'At-Risk': 'Start a win-back campaign with a personalized re-engagement offer.',
    Inactive: 'Run a reactivation campaign and ask for feedback before offering incentives.'
  };

  return recommendations[segment] || 'Monitor this customer and personalize future offers.';
}

function customerStatus(segment) {
  if (segment === 'Inactive') return 'Inactive';
  if (segment === 'At-Risk') return 'At Risk';
  return 'Active';
}

module.exports = {
  calculatePatronIndex,
  classifyCustomer,
  recommendationFor,
  customerStatus
};
