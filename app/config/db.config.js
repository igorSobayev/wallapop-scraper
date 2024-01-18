import db from './db.js'
export async function init() {
  try {
    await db.mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('Successfully connect to MongoDB.')
  } catch (err) {
    console.error('Connection error', err)
    process.exit(1)
  }
}

export default {
  init
}
