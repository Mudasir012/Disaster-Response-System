export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`)

    socket.on('subscribe_region', ({ region }) => {
      socket.join(`region:${region}`)
    })

    socket.on('unsubscribe_region', ({ region }) => {
      socket.leave(`region:${region}`)
    })

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`)
    })
  })

  console.log('[Socket] Socket.io handler initialized')
}
