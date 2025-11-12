let io;

export function setIO(socketIO) {
  io = socketIO;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
