export function normalizeCustomer (item = {}) {
  // Already in frontend/demo shape
  if (item.id && item.totalSpending !== undefined) return item

  const features = item.features || {}
  const prediction = item.prediction || {}
  const totalSpent = Number(item.totalSpent || 0)
  const totalOrders = Number(item.totalOrders || 0)
  const segment = prediction.segment || 'Regular'
  const patronIndex = Number(prediction.patronIndex ?? 0)

  return {
    id: item.customerId || item._id || 'Unknown',
    name: item.name || 'Unknown Customer',
    email: item.email || '',
    phone: item.phone || 'Not provided',
    location: item.location || 'Not provided',
    segment,
    totalSpending: totalSpent,
    totalPurchases: totalOrders,
    averageOrderValue: Number(features.averageOrderValue ?? (totalOrders ? totalSpent / totalOrders : 0)),
    purchaseFrequency: Number(features.frequency ?? totalOrders),
    recency: Number(features.recency ?? 0),
    lastPurchase: item.updatedAt || '',
    lastPurchaseText: features.recency !== undefined ? `${features.recency} days ago` : 'Recently',
    patronIndex,
    status: item.status || (segment === 'At-Risk' ? 'At Risk' : segment === 'Inactive' ? 'Inactive' : 'Active'),
    customerSince: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Not available',
    recommendation: prediction.recommendation || 'Monitor purchase behaviour and personalize future offers.'
  }
}
