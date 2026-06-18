export function errorHandler(err, req, res, next) {
  const status  = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} — ${status} ${message}`)
    if (err.stack) console.error(err.stack)
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  })
}
