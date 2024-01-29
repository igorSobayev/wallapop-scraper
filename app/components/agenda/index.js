import Agenda from 'agenda'
import updateTracksService from '../../services/tracks/tracks.updateTracks.service.js'
import shared from '../../config/shared.js'

async function init() {
    console.log('INICIANDO AGENDA')

    const mongoConnectionString = process.env.DB_URI

    const agenda = new Agenda({ db: { address: mongoConnectionString, collection: 'jobs' } })

    agenda.define('syncDaily', async job => {
        console.log('RUNNING syncDaily job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.DAILY] })
    })

    agenda.define('syncTwice', async job => {
        console.log('RUNNING syncTwice job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.TWICE] })
    })

    agenda.define('syncSixHours', async job => {
        console.log('RUNNING syncSixHours job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.SIX_HOURS] })
    })

    agenda.define('syncThreeHours', async job => {
        console.log('RUNNING syncThreeHours job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.THREE_HOURS] })
    })

    agenda.define('syncOneHour', async job => {
        console.log('RUNNING syncOneHour job at:', new Date())
        await updateTracksService({ trackUpdatePreference: [shared.PLANS_CONFIG.ONE_HOUR] })
    })

    // IIFE to give access to async/await
    await agenda.start();
    console.log('AGENDA STARTED')

    const nextRunStartDay = _GetNextRun()

    // Run sync tracks every day at 12:00 AM (timezone: 'Europe/Madrid')
    await agenda.every('0 0 * * *', 'syncDaily', {
        timezone: 'Europe/Madrid',
    })

    await agenda.every('0 */12 * * *', 'syncTwice', {
        skipImmediate: true,
        nextRunAt: nextRunStartDay,
        timezone: 'Europe/Madrid',
    })

    agenda.every('0 */6 * * *', 'syncSixHours', { 
        skipImmediate: true,
        nextRunAt: nextRunStartDay,
        timezone: 'Europe/Madrid',
    })

    agenda.every('0 */3 * * *', 'syncThreeHours', { 
        skipImmediate: true,
        nextRunAt: nextRunStartDay,
        timezone: 'Europe/Madrid',
    })

    agenda.every('0 */1 * * *', 'syncOneHour', { 
        skipImmediate: true,
        nextRunAt: nextRunStartDay,
        timezone: 'Europe/Madrid',
    })
}


function _GetNextRun () {
    // Obtener la fecha y hora actual en el timezone 'Europe/Madrid'
    const now = new Date()
    const nowTimezone = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }))

    // Calcular la próxima ejecución a las 12 de la noche o la siguiente más cercana en 'Europe/Madrid'
    const nextRunStartDay = new Date(nowTimezone)
    nextRunStartDay.setHours(12, 0, 0, 0)
    if (nowTimezone > nextRunStartDay) {
        nextRunStartDay.setDate(nextRunStartDay.getDate() + 1)
    }

    return nextRunStartDay
}

export default {
    init
}