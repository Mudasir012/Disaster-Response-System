export function errorHandler(err, req, res, _next) {
  console.error('[Error]', err.message, err.stack)
  const status = err.status || 500
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
