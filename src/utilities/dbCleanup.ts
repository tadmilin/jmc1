import mongoose from 'mongoose'

export const cleanupConnections = async () => {
  try {
    // ปิด connections ทั้งหมด
    await mongoose.disconnect()

    // รอให้ connections ปิดจริงๆ
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Database connections cleaned up')
  } catch (error) {
    console.error('Error cleaning up connections:', error)
  }
}

export const getConnectionCount = () => {
  return mongoose.connections.length
}

export const forceCloseConnections = async () => {
  try {
    for (const connection of mongoose.connections) {
      if (connection.readyState !== 0) {
        await connection.close(true) // force close
      }
    }
    console.log('All connections force closed')
  } catch (error) {
    console.error('Error force closing connections:', error)
  }
}
