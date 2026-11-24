/**
 * NoSQL Injection & Query Sanitization Middleware
 * Recursively strips or rejects MongoDB operator keys ($gt, $ne, $where, etc.)
 * from req.body, req.query, and req.params to safeguard queries.
 */
function sanitizeValue(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  const cleanObj = {};
  for (const [key, val] of Object.entries(value)) {
    // Strip keys starting with $ or containing . which could manipulate Mongo queries
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleanObj[key] = sanitizeValue(val);
  }
  return cleanObj;
}

const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = sanitizeMiddleware;
