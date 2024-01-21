import Agenda from 'agenda'

async function init() {
    console.log('INICIANDO AGENDA')

    const mongoConnectionString = process.env.DB_URI

    const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'jobs' } })

    agenda.define('pruebita', async job => {
        console.log('ESTAMO AKA ' + new Date())
    })

    // IIFE to give access to async/await
    await agenda.start();
    console.log('AGENDA STARTED')

    // await agenda.every('1 minutes', 'pruebita')

    // Run contract extender every day at 6:00 AM (timezone: 'Europe/Madrid')
    await agenda.every('0 4 * * *', 'pruebita', {
        timezone: 'Europe/Madrid',
    })
}


export default {
    init
}