import db from './db.js'
export async function init() {
  try {

    let uri = process.env.DB_URI

    if (process.env.NODE_ENV === 'test') { // TODO no funca
      uri = process.env.DB_URI_TEST
    }

    await db.mongoose.connect(uri, {
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
