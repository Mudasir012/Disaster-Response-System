import logger from '../utils/logger.js'

export default function errorHandler(err, req, res, next) {
  logger.error(`${err.message}`, { stack: err.stack, path: req.path })

  const status = err.status || 500
  res.status(status).json({
    error: err.message,
    status,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
